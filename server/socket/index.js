            

import GameHandler from "./game.js";
import MatchmakingHandler from "./matchmaking.js";
import { DisconnectHandler } from "./disconnect.js";
import { verifyToken } from "@clerk/backend";
import User from "../models/User.js";

// Map<userId, Set<socketId>>
const onlineUsers = new Map();

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      console.log("Socket handshake token:", token);

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      console.log("verifyToken payload.sub:", payload?.sub);

      const user = await User.findOne({
        clerkId: payload.sub,
      })
        .select("_id")
        .lean();

      console.log("Resolved DB user id:", user?._id?.toString());

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Detailed connect info
    console.log("Connected userId (pre-set):", socket.userId, "socketId:", socket.id);

    const userId = socket.userId;

    // create set if user not exists
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    // add socket id
    onlineUsers.get(userId).add(socket.id);

    // total unique online users
     io.emit("online-users-count", onlineUsers.size);

    socket.emit("online-users-count", onlineUsers.size);

    // log current onlineUsers map (userId -> number of sockets)
    console.log(
      "Online map:",
      [...onlineUsers.entries()].map(([k, s]) => [k, s.size])
    );

    // optional: send online users list
    io.emit("online-users", [...onlineUsers.keys()]);

    MatchmakingHandler(io, socket);
    GameHandler(io, socket);

    DisconnectHandler(io, socket, onlineUsers);
  });
};

export default setupSocket;

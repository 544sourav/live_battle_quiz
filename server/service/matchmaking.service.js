import Match from "../models/Match.js";
import { startMatch } from "./game.service.js";

const waitingList = [];

export const addToWaitingList = async ({ io, socket, userId, userName }) => {
  console.log(`User ${userId} (${userName}) is looking for a match.`);

  // prevent duplicate entry
  const alreadyWaiting = waitingList.find((player) => player.userId === userId);

  if (alreadyWaiting) return;

  waitingList.push({
    socketId: socket.id,
    userId,
    userName,
  });

  if (waitingList.length < 2) return;

  const player1 = waitingList.shift();
  const player2 = waitingList.shift();

  const socket1 = io.sockets.sockets.get(player1.socketId);
  const socket2 = io.sockets.sockets.get(player2.socketId);

  // handle disconnected users
  if (!socket1 && socket2) {
    waitingList.unshift(player2);
    return;
  }

  if (!socket2 && socket1) {
    waitingList.unshift(player1);
    return;
  }

  if (!socket1 && !socket2) {
    return;
  }

  console.log(`Match found between ${player1.userId} and ${player2.userId}`);

  const roomId = `room_${Date.now()}`;

  socket1.join(roomId);
  socket2.join(roomId);
  socket1.currentRoom = roomId;
  socket2.currentRoom = roomId;

  const match = await Match.create({
    roomId,
    players: [
      { user: player1.userId, userName: player1.userName },
      { user: player2.userId, userName: player2.userName },
    ],
    totalQuestions: 10,
    matchStatus: "waiting",
  });

  const payload = {
    roomId,
    match: match,
  };

  io.to(roomId).emit("match:found", payload);

  await startMatch({
    io,
    roomId,
  });
};

export const removeFromWaitingList = ({ userId }) => {
  const index = waitingList.findIndex((player) => player.userId === userId);
  if (index !== -1) {
    waitingList.splice(index, 1);
    console.log(`User ${userId} removed from waiting list.`);
  }
};

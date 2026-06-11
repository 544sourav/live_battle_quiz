import Match from "../models/Match.js";
import { handlePlayerExit } from "../service/game.service.js";

export const DisconnectHandler = (io, socket, onlineUsers) => {
  // Capture userId early, before disconnect event
  const userId = socket.userId;

  socket.on("disconnecting", () => {
    socket.__matchRooms = [...socket.rooms].filter(
      (room) => room !== socket.id,
    );
    console.log("[DISCONNECTING] Socket rooms:", [...socket.rooms]);
    console.log("[DISCONNECTING] Captured match rooms:", socket.__matchRooms);
  });

  socket.on("disconnect", async () => {
    console.log("=== USER DISCONNECTED ===");
    console.log("Socket ID:", socket.id);
    console.log("Captured userId:", userId);

    if (!userId) {
      console.log("No userId captured, returning");
      return;
    }

    // Now handle online users cleanup
    console.log("[DISCONNECT] Updating onlineUsers map");
    const userSockets = onlineUsers.get(userId);

    if (!userSockets) {
      console.log("[DISCONNECT] No sockets found for user in onlineUsers");
      console.log("=== DISCONNECT COMPLETE ===\n");
      return;
    }

    // remove disconnected socket
    userSockets.delete(socket.id);
    console.log(
      `[DISCONNECT] Removed socket ${socket.id}, remaining: ${userSockets.size}`,
    );

    const shouldProcessExit = userSockets.size === 0;

    if (shouldProcessExit) {
      onlineUsers.delete(userId);
      console.log(`[DISCONNECT] Removed user entirely from onlineUsers`);

      // Check if user was in any active match
      try {
        console.log(
          `[DISCONNECT] Searching for non-completed matches with userId: ${userId}`,
        );

        const matchRoomIds = socket.__matchRooms || [];

        let matches = [];

        if (matchRoomIds.length > 0) {
          console.log(
            "[DISCONNECT] Rooms captured at disconnecting:",
            matchRoomIds,
          );
          matches = await Match.find({
            roomId: { $in: matchRoomIds },
            matchStatus: { $ne: "completed" },
          });
        }

        if (matches.length === 0) {
          console.log(
            "[DISCONNECT] No rooms captured, falling back to DB lookup",
          );
          matches = await Match.find({
            "players.user": userId,
            matchStatus: { $ne: "completed" },
          });
        }

        console.log(
          `[DISCONNECT] Non-completed matches found: ${matches.length}`,
        );
        matches.forEach((m) => {
          console.log(
            `  - Match: ${m.roomId}, Status: ${m.matchStatus}, Players: ${m.players.map((p) => p.user.toString())}`,
          );
        });

        for (const match of matches) {
          console.log(
            `[DISCONNECT] Calling handlePlayerExit for room ${match.roomId}`,
          );
          await handlePlayerExit({
            io,
            roomId: match.roomId,
            exitingUserId: userId,
          });
          console.log(
            `[DISCONNECT] handlePlayerExit completed for ${match.roomId}`,
          );
        }

        if (matches.length === 0) {
          console.log(`[DISCONNECT] No active match to end`);
        }
      } catch (err) {
        console.error("[DISCONNECT] Error handling match disconnect:", err);
        console.error(err.stack);
      }
    }

    io.emit("online-users-count", onlineUsers.size);
    io.emit("online-users", [...onlineUsers.keys()]);
    console.log("=== DISCONNECT COMPLETE ===\n");
  });
};

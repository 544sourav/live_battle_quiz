import {
  startMatch,
  submitanswer,
  handlePlayerExit,
} from "../service/game.service.js";
import Match from "../models/Match.js";

const GameHandler = (io, socket) => {
  // socket.on("match:begin", async ({ roomId }) => {
  //   try {
  //     await startMatch({ io, roomId });
  //   } catch (err) {
  //     console.error("Error starting match: ", err);
  //     socket.emit("match:error", {
  //       message: "An error occurred while starting the match.",
  //     });
  //   }
  // });
  socket.on("question:answer", async (data) => {
    try {
      await submitanswer({
        io,
        socket,
        roomId: data.roomId,
        questionId: data.questionId,
        selectedOptionIndex: data.selectedOptionIndex,
        responseTime: data.responseTime,
      });
    } catch (err) {
      console.error("Error submitting answer: ", err);
      socket.emit("match:error", {
        message: "An error occurred while submitting the answer.",
      });
    }
  });

  socket.on("match:exit", async (data) => {
    try {
      const { roomId } = data;
      await handlePlayerExit({
        io,
        roomId,
        exitingUserId: socket.userId,
      });
    } catch (err) {
      console.error("Error handling match exit: ", err);
      socket.emit("match:error", {
        message: "An error occurred while exiting the match.",
      });
    }
  });
};

export default GameHandler;

import { getRandomQuestions } from "../utils/getRandomQuestions.js";
import roomTimers from "../utils/roomTimers.js";
import Match from "../models/Match.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

const questionWinners = new Map();

const calculateEloRating = (rating, opponentRating, score, k = 32) => {
  const expectedScore = 1 / (1 + 10 ** ((opponentRating - rating) / 400));
  return Math.round(rating + k * (score - expectedScore));
};

const updateUserMatchStats = async ({
  userId,
  opponentRating,
  isWinner,
  isDraw,
  currentAccuracy,
  currentAvgResponseTime,
}) => {
  const user = await User.findById(userId).select(
    "rating averageAccuracy averageResponseTime matchesPlayed wins losses",
  );
  if (!user) return;

  const matchesPlayed = user.matchesPlayed || 0;
  const newMatchesPlayed = matchesPlayed + 1;
  const newAverageAccuracy =
    ((user.averageAccuracy || 0) * matchesPlayed + currentAccuracy) /
    newMatchesPlayed;
  const newAverageResponseTime =
    ((user.averageResponseTime || 0) * matchesPlayed + currentAvgResponseTime) /
    newMatchesPlayed;

  const score = isDraw ? 0.5 : isWinner ? 1 : 0;
  const newRating = calculateEloRating(
    user.rating || 800,
    opponentRating || 800,
    score,
  );

  const update = {
    $set: {
      rating: newRating,
      averageAccuracy: newAverageAccuracy,
      averageResponseTime: newAverageResponseTime,
      matchesPlayed: newMatchesPlayed,
    },
  };

  if (!isDraw) {
    update.$inc = isWinner ? { wins: 1 } : { losses: 1 };
  }

  await User.findByIdAndUpdate(userId, update, { new: true });
};

export const startMatch = async ({ io, roomId }) => {
  const match = await Match.findOne({ roomId });

  if (!match) {
    throw new Error("Match not found");
  }

  const userId1 = match.players[0].user;
  const userId2 = match.players[1].user;
  const userName1 = await User.findById(userId1).select("userName imageUrl");
  const userName2 = await User.findById(userId2).select("userName imageUrl");
  const player1 = {
    userId: userId1,
    userName: userName1.userName,
    imageUrl: userName1.imageUrl,
  };
  const player2 = {
    userId: userId2,
    userName: userName2.userName,
    imageUrl: userName2.imageUrl,
  };

  const questions = await getRandomQuestions({
    numQuestions: 10,
    userId1,
    userId2,
  });

  match.questions = questions.map((q) => q._id);

  match.matchStatus = "ongoing";
  match.startedAt = new Date();
  match.totalQuestions = questions.length;

  await match.save();

  const payload = {
    roomId,
    players: [player1, player2],
    totalRounds: match.totalQuestions,
    totalQuestions: match.totalQuestions,
  };
  io.to(roomId).emit("match:start", payload);

  sendQuestions({ io, roomId });
};

export const sendQuestions = async ({ io, roomId }) => {
  const match = await Match.findOne({ roomId });

  if (!match) {
    throw new Error("Match not found");
  }

  const questionId = match.questions[match.currentQuestionIndex];

  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error("Question not found");
  }

  questionWinners.set(roomId, null);

  io.to(roomId).emit("question:new", {
    roundNumber: match.currentQuestionIndex + 1,
    question: {
      _id: question._id,
      questionText: question.question,
      options: question.options,
      difficulty: question.difficulty || "Medium",
    },
    timer: question.timeLimit || 15000,
  });
  const timeLimit = question.timeLimit * 1000 || 15000;
  startquestionTimer({ io, roomId, timeLimit });
};

export const startquestionTimer = ({ io, roomId, timeLimit }) => {
  // console.log(`Starting timer for room ${roomId} with time limit ${timeLimit}ms`);
  if (roomTimers.has(roomId)) {
    clearTimeout(roomTimers.get(roomId));
  }

  const timer = setTimeout(async () => {
    await movetoNextQuestion({ io, roomId });
  }, timeLimit);

  roomTimers.set(roomId, timer);
};

export const movetoNextQuestion = async ({ io, roomId }) => {
  const match = await Match.findOne({ roomId });

  if (!match) {
    throw new Error("Match not found");
  }

  match.currentQuestionIndex += 1;

  match.answeredPlayers = [];

  const isMatchCompleted = match.currentQuestionIndex >= match.totalQuestions;

  if (isMatchCompleted) {
    match.matchStatus = "completed";
    match.endedAt = new Date();

    const playerIds = match.players.map((p) => p.user);
    const users = await User.find({ _id: { $in: playerIds } }).select(
      "userName rating",
    );

    const playerInfo = match.players.map((p) => {
      const user = users.find((u) => u._id.toString() === p.user.toString());
      return {
        userId: p.user.toString(),
        userName: user?.userName || "Player",
        score: p.score,
      };
    });

    let winnerId = null;
    if (match.players[0].score > match.players[1].score) {
      winnerId = match.players[0].user.toString();
    } else if (match.players[1].score > match.players[0].score) {
      winnerId = match.players[1].user.toString();
    }

    match.winner = winnerId ? winnerId : null;

    const userRatingMap = new Map(
      users.map((user) => [user._id.toString(), user.rating || 800]),
    );

    await Promise.all(
      match.players.map((player) => {
        const opponent = match.players.find(
          (p) => p.user.toString() !== player.user.toString(),
        );
        const isWinner = winnerId ? player.user.toString() === winnerId : false;
        const isDraw = !winnerId;
        const currentAccuracy = match.totalQuestions
          ? player.correctAnswers / match.totalQuestions
          : 0;
        const currentAvgResponseTime = player.averageResponseTime || 0;

        return updateUserMatchStats({
          userId: player.user,
          opponentRating: userRatingMap.get(opponent.user.toString()),
          isWinner,
          isDraw,
          currentAccuracy,
          currentAvgResponseTime,
        });
      }),
    );

    await match.save();

    const winnerName = winnerId
      ? playerInfo.find((p) => p.userId === winnerId)?.userName
      : null;

    io.to(roomId).emit("match:end", {
      winnerId,
      winnerName,
      isDraw: !winnerId,
      players: playerInfo,
    });
    questionWinners.delete(roomId);
    return;
  }
  await match.save();
  sendQuestions({ io, roomId });
};
const submitanswer = async ({
  io,
  socket,
  roomId,
  questionId,
  selectedOptionIndex,
  responseTime,
}) => {
  const match = await Match.findOne({ roomId });
  if (!match) {
    throw new Error("Match not found");
  }
  if (match.answeredPlayers.includes(socket.userId)) {
    return;
  }
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error("Question not found");
  }
  const isCorrect = question.correctAnswer === selectedOptionIndex;
  const currentWinner = questionWinners.get(roomId);

  const player = match.players.find(
    (p) => p.user.toString() === socket.userId.toString(),
  );

  if (isCorrect && !currentWinner) {
    player.score += question.points || 10;
    player.correctAnswers += 1;
    questionWinners.set(roomId, socket.userId.toString());
    await User.findByIdAndUpdate(socket.userId, {
      $addToSet: { questionsAttempted: question._id },
    });
  } else if (isCorrect) {
    player.correctAnswers += 1;
    await User.findByIdAndUpdate(socket.userId, {
      $addToSet: { questionsAttempted: question._id },
    });
  } else {
    player.wrongAnswers += 1;
  }

  player.totalResponseTime += responseTime;

  player.averageResponseTime =
    player.totalResponseTime / (player.correctAnswers + player.wrongAnswers);

  match.answeredPlayers.push(socket.userId);
  await match.save();

  const scores = {};
  match.players.forEach((p) => {
    scores[p.user.toString()] = p.score;
  });

  socket.emit("question:result", {
    correct: isCorrect,
    correctAnswer: question.correctAnswer,
    correctAnswerIndex: question.correctAnswer,
    explanation: question.explanation || "",
    scores: scores,
  });

  io.to(roomId).emit("match:scoreUpdate", {
    scores: scores,
  });

  const allAnswered = match.answeredPlayers.length === match.players.length;
  if (allAnswered) {
    if (roomTimers.has(roomId)) {
      clearTimeout(roomTimers.get(roomId));
    }
    await movetoNextQuestion({ io, roomId });
  }
};

export const handlePlayerExit = async ({ io, roomId, exitingUserId }) => {
  try {
    console.log("\n===== HANDLE PLAYER EXIT START =====");
    console.log(
      `handlePlayerExit called: roomId=${roomId}, exitingUserId=${exitingUserId}`,
    );

    const match = await Match.findOne({ roomId });
    console.log(`Match found:`, match ? "yes" : "no", match?.matchStatus);

    if (!match || match.matchStatus === "completed") {
      console.log("Match not found or already completed, returning");
      console.log("===== HANDLE PLAYER EXIT END (EARLY) =====\n");
      return;
    }

    console.log(
      `Match players: ${match.players.map((p) => p.user.toString()).join(", ")}`,
    );

    // Clear question timer if active
    if (roomTimers.has(roomId)) {
      clearTimeout(roomTimers.get(roomId));
      roomTimers.delete(roomId);
      console.log("Cleared question timer");
    }

    // Find the opponent
    const exitingPlayer = match.players.find(
      (p) => p.user.toString() === exitingUserId.toString(),
    );
    const opponent = match.players.find(
      (p) => p.user.toString() !== exitingUserId.toString(),
    );

    console.log(`Exiting player found:`, !!exitingPlayer);
    console.log(`Opponent found:`, !!opponent);

    if (!opponent) {
      console.log("No opponent found!");
      console.log("===== HANDLE PLAYER EXIT END (NO OPPONENT) =====\n");
      return;
    }

    // Declare opponent as winner
    const winnerId = opponent.user.toString();
    console.log(`Winner declared: ${winnerId}`);

    match.matchStatus = "completed";
    match.endedAt = new Date();
    match.winner = winnerId;

    const playerIds = match.players.map((p) => p.user);
    const users = await User.find({ _id: { $in: playerIds } }).select(
      "userName rating",
    );

    const playerInfo = match.players.map((p) => {
      const user = users.find((u) => u._id.toString() === p.user.toString());
      return {
        userId: p.user.toString(),
        userName: user?.userName || "Player",
        score: p.score,
      };
    });

    console.log(
      `Player info: ${playerInfo.map((p) => `${p.userName}(${p.score})`).join(", ")}`,
    );

    const userRatingMap = new Map(
      users.map((user) => [user._id.toString(), user.rating || 800]),
    );

    // Update stats for both players
    console.log("Updating player stats...");
    await Promise.all(
      match.players.map((player) => {
        const isWinner = player.user.toString() === winnerId;
        const currentAccuracy = match.totalQuestions
          ? player.correctAnswers / match.totalQuestions
          : 0;
        const currentAvgResponseTime = player.averageResponseTime || 0;

        console.log(
          `  - ${player.user.toString()}: isWinner=${isWinner}, accuracy=${currentAccuracy}`,
        );

        return updateUserMatchStats({
          userId: player.user,
          opponentRating: userRatingMap.get(
            match.players.find(
              (p) => p.user.toString() !== player.user.toString(),
            ).user,
          ),
          isWinner,
          isDraw: false,
          currentAccuracy,
          currentAvgResponseTime,
        });
      }),
    );

    await match.save();
    console.log("Match saved to database");

    console.log(
      `Emitting match:end to room ${roomId}: winnerId=${winnerId}, reason=Opponent disconnected`,
    );

    io.to(roomId).emit("match:end", {
      winnerId,
      winnerName: playerInfo.find((p) => p.userId === winnerId)?.userName,
      isDraw: false,
      players: playerInfo,
      exitReason: "Opponent disconnected",
    });

    console.log(`Match end event emitted successfully`);
    console.log("===== HANDLE PLAYER EXIT END =====\n");

    questionWinners.delete(roomId);
  } catch (err) {
    console.error("Error handling player exit:", err);
  }
};

export { submitanswer };

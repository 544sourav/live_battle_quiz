import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocket } from "../Socket/socketProvider";
import { SOCKET_EVENTS } from "../Socket/socketEvents";
import { Header } from "../components/BattleSpace/Header";
import { UserCard } from "../components/BattleSpace/UserCard";
import { Question } from "../components/BattleSpace/Question";
import { Loading } from "../components/core/Loading";

export const BattleSpace = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [questionData, setQuestionData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matchStatus, setMatchStatus] = useState("starting"); // starting, active, ended
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [questionResult, setQuestionResult] = useState(null);
  const [scores, setScores] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [matchEndData, setMatchEndData] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [questionTimer, setQuestionTimer] = useState(30);

  // Match Start - Set up initial players
  useEffect(() => {
    const handleMatchStart = (data) => {
      console.log("Match Started:", data);
      setPlayers(data.players || []);
      setRoomId(data.roomId);
      setTotalRounds(data.totalRounds || 5);
      const initialScores = {};
      data.players?.forEach((player) => {
        initialScores[player.userId] = 0;
      });
      setScores(initialScores);
      setMatchStatus("active");
    };

    socket.on(SOCKET_EVENTS.MATCH_START, handleMatchStart);
    return () => socket.off(SOCKET_EVENTS.MATCH_START, handleMatchStart);
  }, [socket]);

  // New Question
  useEffect(() => {
    const handleNewQuestion = (data) => {
      console.log("New Question:", data);
      setQuestionData(data.question);
      setCurrentRound(data.roundNumber || currentRound);
      setQuestionTimer(data.timer || 15);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setQuestionResult(null);
    };

    socket.on(SOCKET_EVENTS.QUESTION_NEW, handleNewQuestion);
    return () => socket.off(SOCKET_EVENTS.QUESTION_NEW, handleNewQuestion);
  }, [socket, currentRound]);

  // Question Result
  useEffect(() => {
    const handleQuestionResult = (data) => {
      console.log("Question Result:", data);
      setQuestionResult({
        correct: data.correct,
        correctAnswer: data.correctAnswer,
        correctAnswerIndex: data.correctAnswerIndex,
        explanation: data.explanation,
        scores: data.scores || {},
      });
      if (data.scores) {
        setScores(data.scores);
      }
    };

    socket.on(SOCKET_EVENTS.QUESTION_RESULT, handleQuestionResult);
    return () =>
      socket.off(SOCKET_EVENTS.QUESTION_RESULT, handleQuestionResult);
  }, [socket]);

  // Match End
  useEffect(() => {
    const handleMatchEnd = (data) => {
      console.log("Match Ended:", data);
      const endScores = {};

      data.players?.forEach((player) => {
        endScores[player.userId] = player.score;
      });

      setMatchStatus("ended");
      setMatchEndData({
        winnerId: data.winnerId,
        winnerName: data.winnerName,
        isDraw: !!data.isDraw,
        scores: endScores,
        players: data.players,
      });
    };

    socket.on(SOCKET_EVENTS.MATCH_END, handleMatchEnd);
    return () => socket.off(SOCKET_EVENTS.MATCH_END, handleMatchEnd);
  }, [socket]);

  // Score Update
  useEffect(() => {
    const handleScoreUpdate = (data) => {
      console.log("Score Updated:", data);
      if (data.scores) {
        setScores(data.scores);
      }
    };

    socket.on(SOCKET_EVENTS.MATCH_SCORE_UPDATE, handleScoreUpdate);
    return () =>
      socket.off(SOCKET_EVENTS.MATCH_SCORE_UPDATE, handleScoreUpdate);
  }, [socket]);

  // Timer Countdown
  useEffect(() => {
    if (isAnswerSubmitted || !questionData) {
      return;
    }

    const timerInterval = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isAnswerSubmitted, questionData]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (questionTimer === 0 && !isAnswerSubmitted && selectedAnswer !== null) {
      const timeout = setTimeout(() => {
        setIsAnswerSubmitted(true);
        socket.emit(SOCKET_EVENTS.QUESTION_ANSWER, {
          roomId,
          questionId: questionData._id,
          selectedOptionIndex: selectedAnswer,
          responseTime: 30,
        });
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [
    questionTimer,
    isAnswerSubmitted,
    selectedAnswer,
    questionData,
    socket,
    roomId,
  ]);

  // Handle answer submission
  const handleAnswerSelect = (optionIndex) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(optionIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null && questionData && !isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      socket.emit(SOCKET_EVENTS.QUESTION_ANSWER, {
        roomId,
        questionId: questionData._id,
        selectedOptionIndex: selectedAnswer,
        responseTime: 30 - questionTimer,
      });
    }
  };

  const handleExitMatch = () => {
    if (matchStatus === "active") {
      socket.emit("match:exit", { roomId });
    } else {
      socket.emit(SOCKET_EVENTS.MATCH_CANCEL, { roomId });
    }
    navigate("/dashboard/battle");
  };

  if (matchStatus === "ended" && matchEndData) {
    const maxScore = Math.max(...Object.values(matchEndData.scores || {}));
    const isDraw = matchEndData.isDraw;
    const isWinner = !isDraw && matchEndData.winnerId === currentUser?._id;
    const title = isDraw
      ? "It's a Draw!"
      : isWinner
        ? "🎉 You Won!"
        : "You Lost";
    const subtitle = isDraw
      ? "Both players scored the same amount."
      : isWinner
        ? `Winner: ${matchEndData.winnerName}`
        : `Winner: ${matchEndData.winnerName}`;

    return (
      <div className="text-white bg-background w-full h-screen flex flex-col">
        <Header onExit={handleExitMatch} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-cardBackground rounded-lg border border-primary/30 p-8 text-center">
              <h1 className="text-4xl font-bold mb-2 text-primary">{title}</h1>
              <p className="text-gray-300 mb-6">{subtitle}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {players.map((player) => {
                  const score = matchEndData.scores[player.userId] || 0;
                  const playerIsWinner = !isDraw && score === maxScore;
                  return (
                    <div
                      key={player.userId}
                      className={`p-4 rounded-lg border-2 ${
                        playerIsWinner
                          ? "bg-primary/20 border-primary"
                          : "bg-secondary/30 border-secondary/50"
                      }`}
                    >
                      <p className="text-lg font-semibold">{player.userName}</p>
                      <p className="text-2xl font-bold text-primary">
                        {score} pts
                      </p>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleExitMatch}
                className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-8 rounded-lg transition"
              >
                Back to Battle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white bg-background w-full min-h-screen flex flex-col">
      <Header
        timer={questionTimer}
        currentRound={currentRound}
        totalRounds={totalRounds}
        onExit={handleExitMatch}
      />

      {matchStatus === "starting" || !questionData ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <Loading />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.55fr_0.85fr] lg:px-8">
            <section className="space-y-6">
              <div className="rounded-4xl border border-white/10 bg-cardBackground/95 p-5 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-primary">
                      Question
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      Answer quickly to stay ahead.
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                    <span className="font-semibold">Round {currentRound}</span>
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span>{totalRounds} total</span>
                  </div>
                </div>
              </div>

              <div className="rounded-4xl border border-white/10 bg-cardBackground/95 p-5 shadow-2xl shadow-black/20">
                <Question
                  questionData={questionData}
                  selectedAnswer={selectedAnswer}
                  onSelectAnswer={handleAnswerSelect}
                  onSubmitAnswer={handleSubmitAnswer}
                  isAnswerSubmitted={isAnswerSubmitted}
                  questionResult={questionResult}
                  timer={questionTimer}
                />
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-4xl border border-white/10 bg-cardBackground/95 p-5 shadow-2xl shadow-black/20">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-primary">
                      Match summary
                    </p>
                    <h3 className="text-xl font-semibold text-white">
                      Live scoreboard
                    </h3>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    {questionTimer}s left
                  </span>
                </div>
                <div className="space-y-4">
                  {players.map((player) => (
                    <UserCard
                      key={player.userId}
                      user={player}
                      score={scores[player.userId] || 0}
                      isCorrect={
                        questionResult
                          ? questionResult.correctPlayers?.includes(
                              player.userId,
                            )
                          : null
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-4xl border border-white/10 bg-secondary/90 p-5 shadow-2xl shadow-black/20">
                <p className="text-sm uppercase tracking-[0.35em] text-primary">
                  Battle notes
                </p>
                <div className="mt-4 space-y-3 text-gray-300">
                  <p>• Choose the best answer before the timer ends.</p>
                  <p>• Correct answers earn points and improve your rating.</p>
                  <p>• Watch the results after each round for feedback.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

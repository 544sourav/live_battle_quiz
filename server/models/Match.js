// models/match.model.js

import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    averageResponseTime: {
      type: Number,
      default: 0,
    },

    totalResponseTime: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const matchSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    players: [playerSchema],

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    matchType: {
      type: String,
      enum: ["1v1", "practice", "tournament"],
      default: "1v1",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    matchStatus: {
      type: String,
      enum: ["waiting", "ongoing", "completed"],
      default: "waiting",
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    answeredPlayers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

matchSchema.index({ roomId: 1 });
matchSchema.index({ matchStatus: 1 });

const Match = mongoose.model("Match", matchSchema);

export default Match;

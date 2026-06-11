// models/analytics.model.js

import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    overallAccuracy: {
      type: Number,
      default: 0,
    },

    averageResponseTime: {
      type: Number,
      default: 0,
    },

    totalMatches: {
      type: Number,
      default: 0,
    },

    totalWins: {
      type: Number,
      default: 0,
    },

    totalLosses: {
      type: Number,
      default: 0,
    },

    topicStats: [
      {
        topic: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Topic",
        },

        matchesPlayed: {
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

        accuracy: {
          type: Number,
          default: 0,
        },

        averageResponseTime: {
          type: Number,
          default: 0,
        },
      },
    ],

    recentPerformance: [
      {
        match: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Match",
        },

        score: {
          type: Number,
          default: 0,
        },

        accuracy: {
          type: Number,
          default: 0,
        },

        responseTime: {
          type: Number,
          default: 0,
        },

        playedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

analyticsSchema.index({ user: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;

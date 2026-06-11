import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },

    password: {
      type: String,
    },

    wins: {
      type: Number,
      default: 0,
    },

    losses: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 800,
    },

    matchesPlayed: {
      type: Number,
      default: 0,
    },

    weakTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],

    strongTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],

    averageAccuracy: {
      type: Number,
      default: 0,
    },

    averageResponseTime: {
      type: Number,
      default: 0,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
    currentRoom: {
      type: String,
      default: null,
    },
    questionsAttempted: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    }],
    role:{
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;

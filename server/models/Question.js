import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number,
      required: true,
    },

    explanation: {
      type: String,
    },

    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    questionType: {
      type: String,
      enum: ["mcq", "integer", "boolean"],
      default: "mcq",
    },

    points: {
      type: Number,
      default: 10,
    },

    timeLimit: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true },
);
const Question = mongoose.model("Question", questionSchema);
export default Question;

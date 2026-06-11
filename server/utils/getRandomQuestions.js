import Question from "../models/Question.js";
import User from "../models/User.js";

export const getRandomQuestions = async ({
  numQuestions,
  userId1,
  userId2,
}) => {
  const [user1, user2] = await Promise.all([
    User.findById(userId1).select("questionsAttempted").lean(),
    User.findById(userId2).select("questionsAttempted").lean(),
  ]);

  const attemptedQuestions = new Set([
    ...(user1?.questionsAttempted ?? []),
    ...(user2?.questionsAttempted ?? []),
  ]);

  const questions = await Question.aggregate([
    {
      $match: {
        _id: { $nin: Array.from(attemptedQuestions) },
      },
    },
    { $sample: { size: numQuestions } },
  ]);

  if (questions.length < numQuestions) {
    throw new Error("Not enough new questions available for both users.");
  }

  return questions;
};

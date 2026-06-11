import { MdCheckCircle, MdCancelPresentation } from "react-icons/md";

export const Question = ({
  questionData,
  selectedAnswer,
  onSelectAnswer,
  onSubmitAnswer,
  isAnswerSubmitted,
  questionResult,
}) => {
  const getOptionStyle = (index) => {
    const baseStyle =
      "w-full p-4 rounded-lg border-2 transition duration-200 font-semibold text-left";

    if (isAnswerSubmitted && questionResult) {
      const isCorrectOption = index === questionResult.correctAnswerIndex;
      const isSelected = index === selectedAnswer;

      if (isCorrectOption) {
        return `${baseStyle} bg-green-500/20 border-green-500 text-green-300`;
      }
      if (isSelected && !isCorrectOption) {
        return `${baseStyle} bg-red-500/20 border-red-500 text-red-300`;
      }
      return `${baseStyle} bg-gray-600/20 border-gray-600 text-gray-400`;
    }

    if (selectedAnswer === index) {
      return `${baseStyle} bg-primary/30 border-primary text-white`;
    }

    return `${baseStyle} bg-cardBackground border-gray-600 text-gray-300 hover:border-primary hover:bg-primary/10 cursor-pointer`;
  };

  return (
    <div className="rounded-4xl border border-white/10 bg-cardBackground/95 p-6 md:p-8 shadow-2xl shadow-black/20 w-full">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-primary">
          {questionData?.difficulty || "Medium"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white leading-tight">
          {questionData?.questionText}
        </h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {questionData?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isAnswerSubmitted && onSelectAnswer(index)}
            disabled={isAnswerSubmitted}
            className={getOptionStyle(index)}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm md:text-base">
                <span className="font-semibold">
                  {String.fromCharCode(65 + index)})
                </span>{" "}
                {option}
              </span>
              {isAnswerSubmitted && questionResult && (
                <>
                  {index === questionResult.correctAnswerIndex ? (
                    <MdCheckCircle size={24} className="text-emerald-400" />
                  ) : index === selectedAnswer &&
                    index !== questionResult.correctAnswerIndex ? (
                    <MdCancelPresentation size={24} className="text-rose-400" />
                  ) : null}
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {isAnswerSubmitted && questionResult && (
        <div
          className={`mt-6 rounded-3xl border px-4 py-4 ${
            selectedAnswer === questionResult.correctAnswerIndex
              ? "border-emerald-500/20 bg-emerald-500/10"
              : "border-rose-500/20 bg-rose-500/10"
          }`}
        >
          <p className="font-semibold text-white mb-2">
            {selectedAnswer === questionResult.correctAnswerIndex
              ? "Correct answer!"
              : "Wrong answer"}
          </p>
          {questionResult.explanation && (
            <p className="text-sm text-gray-300">
              {questionResult.explanation}
            </p>
          )}
        </div>
      )}

      {!isAnswerSubmitted ? (
        <button
          onClick={onSubmitAnswer}
          disabled={selectedAnswer === null}
          className={`mt-6 w-full rounded-full py-3 text-lg font-semibold transition duration-200 ${
            selectedAnswer !== null
              ? "bg-primary text-white hover:bg-primary/80"
              : "bg-white/5 text-gray-400 cursor-not-allowed"
          }`}
        >
          Submit Answer
        </button>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-center text-gray-300">
          Waiting for other players...
        </div>
      )}
    </div>
  );
};

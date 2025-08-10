import React, { useState, useEffect } from "react";
import { questionBank } from "../data/questions";

function getRandomQuestions(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    setQuestions(getRandomQuestions(questionBank, 5));
  }, []);

  function handleOptionClick(option) {
    setSelectedOption(option);
  }

  function handleNext() {
    if (!selectedOption) return;

    if (selectedOption === questions[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }

    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowScore(true);
    }
  }

  function handleRestart() {
    setQuestions(getRandomQuestions(questionBank, 5));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowScore(false);
  }

  if (questions.length === 0) {
    return <div className="text-white">Loading questions...</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-gray-900 p-6 rounded-lg text-white mt-16 shadow-lg relative z-10">
      {!showScore ? (
        <>
          <div className="mb-4 text-xl font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="mb-6 text-lg">{questions[currentIndex].question}</div>
          <div className="space-y-4">
            {questions[currentIndex].options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full py-2 rounded-md border border-gray-600 hover:border-yellow-400 transition
                  ${
                    selectedOption === option
                      ? "bg-yellow-500 text-black font-bold"
                      : "bg-gray-800"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className={`mt-6 w-full py-3 rounded-md font-semibold ${
              selectedOption
                ? "bg-yellow-500 hover:bg-yellow-600 text-black cursor-pointer"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentIndex + 1 === questions.length ? "Finish" : "Next"}
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your Score</h2>
          <p className="text-xl mb-6">
            You scored {score} out of {questions.length}
          </p>
          <button
            onClick={handleRestart}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md font-semibold"
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
}

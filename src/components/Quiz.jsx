import React, { useState, useEffect } from "react";
import { questionBank } from "../data/questions"; // Your questions data
import Rocket from "./Rocket";

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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setQuestions(getRandomQuestions(questionBank, 5));
  }, []);

  const handleOptionClick = (option) => {
    if (isAnimating) return;
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption || isAnimating) return;
    setIsAnimating(true);
  };

  const onRocketLaunchComplete = () => {
    if (selectedOption === questions[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }
    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowScore(true);
    }
    setIsAnimating(false);
  };

  const handleRestart = () => {
    if (isAnimating) return;
    setQuestions(getRandomQuestions(questionBank, 5));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowScore(false);
  };

  if (questions.length === 0) {
    return <div style={{ color: "white" }}>Loading questions...</div>;
  }

  return (
    <>
      <div
        style={{
          maxWidth: "32rem",
          margin: "4rem auto",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          color: "white",
          backgroundColor: isAnimating ? "black" : "#1f2937",
          position: "relative",
          minHeight: "220px",
          textAlign: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          overflow: "hidden",
          boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
          zIndex: 10,
        }}
      >
        {isAnimating ? (
          <Rocket launch={isAnimating} onLaunchComplete={onRocketLaunchComplete} />
        ) : !showScore ? (
          <>
            <div style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", textAlign: "left" }}>
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div style={{ fontSize: "1.125rem", marginBottom: "1.5rem", textAlign: "left" }}>
              {questions[currentIndex].question}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              {questions[currentIndex].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  disabled={isAnimating}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0",
                    marginBottom: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #4b5563",
                    backgroundColor: selectedOption === option ? "#fbbf24" : "#1f2937",
                    color: selectedOption === option ? "black" : "white",
                    fontWeight: selectedOption === option ? "700" : "400",
                    cursor: isAnimating ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!selectedOption || isAnimating}
              style={{
                width: "100%",
                padding: "0.75rem 0",
                borderRadius: "0.375rem",
                fontWeight: "600",
                backgroundColor: selectedOption && !isAnimating ? "#fbbf24" : "#374151",
                color: selectedOption && !isAnimating ? "black" : "#9ca3af",
                cursor: selectedOption && !isAnimating ? "pointer" : "not-allowed",
                border: "none",
                transition: "background-color 0.3s ease",
              }}
            >
              {currentIndex + 1 === questions.length ? "Finish" : "Next"}
            </button>
          </>
        ) : (
          <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "1rem" }}>Your Score</h2>
            <p style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              You scored {score} out of {questions.length}
            </p>
            <button
              onClick={handleRestart}
              style={{
                backgroundColor: "#fbbf24",
                color: "black",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d97706")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fbbf24")}
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </>
  );
}

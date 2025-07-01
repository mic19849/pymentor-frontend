import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubscriptionPrompt from "../components/SubscriptionPrompt";

export default function Quiz() {
  const [quizData, setQuizData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser.includes("{") ? JSON.parse(storedUser) : null;
  const isPremium =
    user?.subscription === "Premium" &&
    new Date(user?.subscriptionExpiry || "") > new Date();

  useEffect(() => {
    if (isPremium) {
      fetch("http://localhost:5000/api/quiz")
        .then((res) => res.json())
        .then((data) => setQuizData(data))
        .catch((err) => console.error("Failed to fetch quiz:", err));
    }
  }, [isPremium]);

  useEffect(() => {
    if (!submitted && quizData.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            handleSubmit();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [current, submitted, quizData]);

  const handleSubmit = () => {
    const correct = quizData[current].correct;
    const userAnswer = selectedAnswers[current];
    if (userAnswer === correct) {
      setScore((prev) => prev + 1);
    }

    if (current + 1 < quizData.length) {
      setCurrent((prev) => prev + 1);
      setTimeLeft(15);
    } else {
      setSubmitted(true);
      const username = user?.username || "Anonymous";
      const finalScore = userAnswer === correct ? score + 1 : score;

      fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: username,
          score: finalScore,
          total: quizData.length,
          answers: selectedAnswers,
          date: new Date().toISOString(),
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Result saved:", data.message))
        .catch((err) => console.error("Error saving result:", err));
    }
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
        <SubscriptionPrompt />
      </div>
    );
  }

  if (!quizData.length) {
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Loading quiz...
      </p>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
          ✅ Quiz Complete!
        </h2>
        <p className="text-lg mb-4 text-gray-800 dark:text-gray-200">
          Your Score: {score} / {quizData.length}
        </p>

        <div className="space-y-4">
          {quizData.map((item, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === item.correct;
            return (
              <div
                key={index}
                className="p-4 rounded-xl border shadow bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-yellow-300 mb-2">
                  Q{index + 1}: {item.question}
                </h3>
                <p className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  Your Answer: {item.options[userAnswer] ?? "No answer"}
                </p>
                {!isCorrect && (
                  <p className="text-green-700 dark:text-green-300">
                    Correct Answer: {item.options[item.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/leaderboard"
            className="inline-block text-indigo-600 dark:text-yellow-400 hover:underline text-lg"
          >
            📊 See Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const { question, options } = quizData[current];
  const progress = Math.round(((current + 1) / quizData.length) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-10 transition-colors duration-300">
      <div className="max-w-2xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-xl transition-all duration-300">
        <div className="mb-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>Question {current + 1} / {quizData.length}</span>
          <span>⏱ {timeLeft}s</span>
        </div>

        <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded mb-6 overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-green-400 to-lime-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-yellow-400">
          Q{current + 1}: {question}
        </h2>

        {options.map((opt, i) => (
          <div
            key={i}
            className={`p-3 rounded-md border mb-3 cursor-pointer transition text-sm sm:text-base ${
              selectedAnswers[current] === i
                ? "bg-indigo-500 dark:bg-indigo-600 border-indigo-400 text-white"
                : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() =>
              setSelectedAnswers((prev) => ({ ...prev, [current]: i }))
            }
          >
            {opt}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={selectedAnswers[current] === undefined}
          className="mt-5 w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50"
        >
          {current + 1 === quizData.length ? "🎯 Submit Quiz" : "➡️ Next"}
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import SubscriptionPrompt from "../components/SubscriptionPrompt";
import CodeEditor from "../components/CodeEditor";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [filter, setFilter] = useState("beginner");
  const [completed, setCompleted] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const subscription = user.subscription || "Free";
  const subscriptionExpiry = user.subscriptionExpiry || null;

  const isPremium =
    subscription === "Premium" &&
    subscriptionExpiry &&
    new Date(subscriptionExpiry) > new Date();

  useEffect(() => {
    fetch("http://localhost:5000/api/lessons")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Failed to fetch lessons:", err));

    if (user?.username) {
      fetch(`http://localhost:5000/api/user/progress?username=${user.username}`)
        .then((res) => res.json())
        .then((data) => setCompleted(data.completedLessons || 0))
        .catch((err) => console.error("Failed to fetch progress:", err));
    }
  }, [user.username]);

  const updateProgress = (lessonIndex) => {
    const nextCompleted = Math.max(completed, lessonIndex + 1);
    setCompleted(nextCompleted);
    fetch("http://localhost:5000/api/user/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, completedLessons: nextCompleted }),
    });
  };

  const filteredLessons = lessons
    .filter((lesson) => lesson.level?.toLowerCase() === filter.toLowerCase())
    .map((lesson, index) => ({
      ...lesson,
      isCompleted: index < completed,
    }));

  const copyToEditor = (code) => {
    window.dispatchEvent(new CustomEvent("copy-to-editor", { detail: { code } }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* 📘 Lessons Section */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-5 rounded-xl shadow mb-6 transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold">
              Python Lessons ({filter}) - <span className="text-yellow-300">{completed} completed</span>
            </h2>
            <div className="mt-4 sm:mt-0 space-x-2">
              <button
                onClick={() => setFilter("beginner")}
                className={`px-4 py-2 rounded font-medium transition ${
                  filter === "beginner"
                    ? "bg-yellow-400 text-black"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setFilter("advanced")}
                className={`px-4 py-2 rounded font-medium transition ${
                  filter === "advanced"
                    ? "bg-yellow-400 text-black"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                Advanced
              </button>
            </div>
          </div>
        </div>

        {/* Lessons or Premium Block */}
        {filter === "advanced" && !isPremium ? (
          <SubscriptionPrompt
            user={user}
            subscription={subscription}
            subscriptionExpiry={subscriptionExpiry}
          />
        ) : (
          filteredLessons.map((lesson, index) => (
            <div
              key={index}
              className={`mb-6 p-5 rounded-xl shadow-lg transition-all duration-300 ${
                lesson.isCompleted
                  ? "bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-yellow-300">
                {lesson.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-3 whitespace-pre-line">
                {lesson.content}
              </p>

              {lesson.explanation && (
                <div className="text-gray-800 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded p-4 mb-3">
                  <h4 className="font-semibold mb-2">📘 Explanation</h4>
                  <p className="whitespace-pre-line">{lesson.explanation}</p>
                </div>
              )}

              {lesson.realWorld && (
                <div className="text-gray-800 dark:text-gray-300 bg-blue-50 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 rounded p-4 mb-3">
                  <h4 className="font-semibold mb-2">💡 Real-World Use</h4>
                  <p className="whitespace-pre-line">{lesson.realWorld}</p>
                </div>
              )}

              {lesson.code && (
                <div className="relative mb-3 group">
                  <pre className="bg-gray-100 dark:bg-gray-900 rounded p-3 overflow-auto text-sm text-gray-900 dark:text-gray-100">
                    <code>{lesson.code}</code>
                  </pre>
                  <button
                    onClick={() => copyToEditor(lesson.code)}
                    className="absolute top-2 right-3 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    title="Copy to Editor"
                  >
                    ⬇ Copy to Editor
                  </button>
                </div>
              )}

              {!lesson.isCompleted && (
                <button
                  onClick={() => updateProgress(index)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm mt-2"
                >
                  ✅ Mark as Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 💻 Code Editor Panel */}
      <div className="w-full lg:w-1/3 sticky top-4 self-start h-fit">
        <div className="rounded-xl border dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900 p-4 transition">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            💻 Code Editor
          </h3>
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}

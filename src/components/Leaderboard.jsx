import React, { useEffect, useState } from "react";

export default function Leaderboard() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError(data.message || "Failed to fetch results.");
          setResults([]);
        } else {
          setResults(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
        setError("Something went wrong while loading results.");
      });
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
        <div className="max-w-3xl mx-auto p-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">❌ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10 transition-all">
      <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-indigo-600 dark:text-yellow-400">
          🏆 Top Learners Leaderboard
        </h1>

        {results.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No scores submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="py-3 px-4 rounded-tl-xl">Rank</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4 rounded-tr-xl">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, index) => (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-white">
                      {getMedal(index)} {index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {res.user}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {res.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

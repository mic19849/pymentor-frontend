// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [quizResults, setQuizResults] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("currentRole"); // ✅ retrieve role from login

    // ✅ Fetch Quiz Results (Admin Only)
    fetch("http://localhost:5000/api/quiz/results", {
      headers: {
        "Content-Type": "application/json",
        "x-role": role,
      },
    })
      .then((res) => res.json())
      .then(setQuizResults)
      .catch((err) => console.error("Failed to fetch quiz results", err));

    // ✅ Fetch Users (Admin Only)
    fetch("http://localhost:5000/api/admin/users", {
      headers: {
        "Content-Type": "application/json",
        "x-role": role,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
        <ul className="list-disc pl-6">
          {users.map((user, i) => (
            <li key={i}>{user.username} ({user.role})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Quiz Results ({quizResults.length})</h2>
        <ul className="list-disc pl-6">
          {quizResults.map((result, i) => (
            <li key={i}>
              {result.user}: {result.score}/{result.total} (
              {new Date(result.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

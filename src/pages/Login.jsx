// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLogin = () => {} }) {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!input || !password) {
      alert("Please enter both email/phone and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: input.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save user details in localStorage
        const user = {
          username: data.username,
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "user",
          subscription: data.subscription || "Free",
          subscriptionExpiry: data.subscriptionExpiry || null,
          displayName: data.displayName || data.username,
          avatar: data.avatar || "",
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("currentUser", user.username);
        localStorage.setItem("userRole", user.role);

        onLogin(user.username);
        navigate("/");
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-yellow-400 mb-6">
          Login to PythonLearn
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Email or Phone"
            className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-sm flex flex-col sm:flex-row justify-between text-gray-600 dark:text-gray-400">
          <Link to="/register" className="mb-2 sm:mb-0 hover:underline dark:text-yellow-400">
            Don't have an account? Register
          </Link>
          <Link to="/forgot-password" className="hover:underline text-gray-500 dark:text-gray-300">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

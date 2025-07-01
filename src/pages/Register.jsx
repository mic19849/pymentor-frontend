// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!identifier || !password || !securityQuestion || !securityAnswer) {
      alert("Please fill in all fields.");
      return;
    }

    const isEmail = identifier.includes("@");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isEmail ? identifier.trim() : "",
          phone: !isEmail ? identifier.trim() : "",
          password,
          securityQuestion,
          securityAnswer,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const userObject = {
          username: identifier,
          role: "user",
          subscription: "Free",
        };

        localStorage.setItem("user", JSON.stringify(userObject));
        localStorage.setItem("currentUser", identifier);
        localStorage.setItem("userRole", "user");

        alert("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 dark:text-yellow-400 mb-6">
          Create Your Account
        </h2>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={securityQuestion}
            onChange={(e) => setSecurityQuestion(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a security question</option>
            <option value="Your favorite color?">Your favorite color?</option>
            <option value="Your first school name?">Your first school name?</option>
            <option value="Your pet's name?">Your pet's name?</option>
          </select>

          <input
            type="text"
            placeholder="Security Answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Register
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 dark:text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

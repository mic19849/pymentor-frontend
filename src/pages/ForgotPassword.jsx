// FILE: src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!identifier || !securityAnswer) {
      return setError("Please fill in all fields.");
    }

    try {
      const response = await fetch("http://localhost:5000/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          securityQuestion: "Your favorite color?",
          securityAnswer,
          newPassword: "__placeholder__",
        }),
      });

      const data = await response.json();

      if (response.status === 404) return setError("❌ Incorrect info or security answer.");
      setError("");
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          securityQuestion: "Your favorite color?",
          securityAnswer,
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) return setError(data.message || "Reset failed");

      alert("✅ Password reset successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a23] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white dark:bg-[#1c1c2e] rounded-2xl shadow-2xl p-8 sm:p-10 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-yellow-400">
          🔐 Forgot Password
        </h2>

        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email or Phone Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Security Question: What is your favorite color? 🎨
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Blue"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>
            )}

            <button
              onClick={handleVerify}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              ✅ Verify & Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>
            )}

            <button
              onClick={handleReset}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              🔄 Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

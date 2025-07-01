// src/pages/Payment.jsx
import React from "react";

export default function Payment() {
  const handleSubscribe = async () => {
    const username = localStorage.getItem("currentUser");
    if (!username) return alert("Please log in first");

    try {
      const res = await fetch("http://localhost:5000/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate Stripe checkout session.");
      }
    } catch (err) {
      console.error("Stripe session error:", err);
      alert("Error starting subscription. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-yellow-400">Upgrade to Premium</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Unlock all lessons, quizzes, and exclusive features.</p>

      <div className="text-xl font-semibold mb-4">₹299 / month</div>

      <button
        onClick={handleSubscribe}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
      >
        Subscribe Now
      </button>
    </div>
  );
}

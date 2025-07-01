import React from "react";
import { useNavigate } from "react-router-dom";

export default function Subscription() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isPremium = user?.subscription === "Premium";
  const expiry = user?.subscriptionExpiry;
  const navigate = useNavigate();

  const handleCancel = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your Premium subscription?\n\n⚠️ This action is NOT refundable. You will lose premium benefits immediately."
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          subscription: "Free",
        }),
      });

      const data = await res.json();
      alert(data.message || "Subscription canceled");

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, subscription: "Free", subscriptionExpiry: null })
      );
      navigate("/profile");
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transition-all duration-300">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-indigo-600 dark:text-yellow-400">
        🛡️ Manage Subscription
      </h1>

      {isPremium ? (
        <>
          <div className="bg-indigo-50 dark:bg-gray-800 p-5 rounded-xl shadow-md mb-6 text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              You’re on the <span className="text-indigo-600 dark:text-yellow-400">Premium</span> plan.
            </p>
            {expiry && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✅ Valid until:{" "}
                <strong>{new Date(expiry).toLocaleDateString()}</strong>
              </p>
            )}
          </div>

          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 p-5 rounded-xl mb-6 text-sm shadow-sm">
            ⚠️ <strong>Warning:</strong> Canceling your Premium subscription is{" "}
            <strong>non-refundable</strong>. You will immediately lose access to quizzes,
            certificates, and all premium features.
          </div>

          {/* 💎 Ultra-Premium Cancel Button */}
          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 shadow-[0_4px_20px_rgba(255,0,120,0.4)] hover:shadow-[0_6px_28px_rgba(255,0,120,0.6)] hover:scale-105 transition-all duration-300"
          >
            ❌ Cancel Premium Subscription
          </button>
        </>
      ) : (
        <div className="bg-yellow-100 dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
            You are currently on a <span className="text-yellow-700 dark:text-yellow-300">Free</span> plan.
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Upgrade to Premium to unlock quizzes, certificates, and exclusive content.
          </p>
        </div>
      )}
    </div>
  );
}

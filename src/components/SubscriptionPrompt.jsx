import React, { useEffect, useState } from "react";

export default function SubscriptionPrompt() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState("Free");
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setSubscription(user.subscription || "Free");
    setSubscriptionExpiry(user.subscriptionExpiry || null);
    setUsername(user.username || "");
  }, []);

  const cancelSubscription = async () => {
    const confirmCancel = window.confirm(
      "⚠️ Are you sure you want to cancel your Premium subscription?\nNote: This is non-refundable."
    );
    if (!confirmCancel) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          subscription: "Free",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Subscription cancelled successfully.");
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          subscription: "Free",
          subscriptionExpiry: null,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSubscription("Free");
        setSubscriptionExpiry(null);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatus(data.message || "❌ Failed to cancel subscription.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error cancelling subscription.");
    } finally {
      setLoading(false);
    }
  };

  const subscribePremium = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (data.id) {
        const stripe = await window.Stripe("pk_test_YOUR_PUBLIC_KEY");
        stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        setStatus("❌ Failed to initiate payment.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error connecting to Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-all">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 dark:text-yellow-400">
          🛡️ Subscription Status
        </h2>

        {subscription === "Premium" ? (
          <>
            <div className="mb-4">
              <p>
                You are currently subscribed to the{" "}
                <strong className="text-green-600 dark:text-green-400">Premium</strong> plan.
              </p>
              {subscriptionExpiry && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  ✅ Valid until: <strong>{new Date(subscriptionExpiry).toLocaleDateString()}</strong>
                </p>
              )}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400 mb-6">
              ⚠️ Canceling will remove access to premium content. This action is{" "}
              <strong>non-refundable</strong>.
            </div>
            <button
              onClick={cancelSubscription}
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-60"
            >
              {loading ? "Processing..." : "❌ Cancel Premium Subscription"}
            </button>
          </>
        ) : (
          <>
            <p className="mb-2 text-center text-gray-700 dark:text-gray-300">
              You are currently on a <strong>Free</strong> plan.
            </p>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              Upgrade to unlock full course access, certificates, quizzes & AI tools.
            </p>
            <button
              onClick={subscribePremium}
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "🚀 Subscribe to Premium ($4.99)"}
            </button>
          </>
        )}

        {status && (
          <p className="mt-5 text-sm text-center font-medium text-blue-600 dark:text-blue-300">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

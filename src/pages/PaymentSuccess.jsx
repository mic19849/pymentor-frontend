// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const username = params.get("user");
  const [status, setStatus] = useState("Processing your subscription...");

  useEffect(() => {
    if (!username) {
      setStatus("❌ Missing username. Cannot activate subscription.");
      return;
    }

    const activatePremium = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            subscription: "Premium",
          }),
        });

        const data = await res.json();
        console.log("✅ Subscription API response:", data);

        if (res.ok) {
          setStatus("✅ Premium activated!");

          const user = JSON.parse(localStorage.getItem("user") || "{}");

          const expiry =
            data.expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

          const updatedUser = {
            ...user,
            subscription: "Premium",
            subscriptionExpiry: expiry,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
          localStorage.setItem("subscription", "Premium");
          localStorage.setItem("subscriptionExpiry", expiry);

          console.log("✅ Updated localStorage user:", updatedUser);

          setTimeout(() => navigate("/profile"), 3000);
        } else {
          setStatus(data.message || "❌ Failed to activate Premium.");
        }
      } catch (err) {
        console.error("❌ Activation error:", err);
        setStatus("❌ Something went wrong while activating Premium.");
      }
    };

    activatePremium();
  }, [username, navigate]);

  return (
    <div className="max-w-lg mx-auto text-center mt-20 p-6 bg-white dark:bg-gray-900 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
      <p className="mb-4">{status}</p>
      <p className="text-sm text-gray-500">You will be redirected to your profile shortly...</p>
    </div>
  );
}

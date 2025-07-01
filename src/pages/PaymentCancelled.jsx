// src/pages/PaymentCancelled.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancelled() {
  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-red-100 text-red-700 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p className="mb-4">Your payment was not completed. If this was a mistake, you can try again.</p>
      <Link to="/payment" className="text-indigo-600 hover:underline font-semibold">
        Go back to payment page
      </Link>
    </div>
  );
}

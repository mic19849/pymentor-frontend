// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Leaderboard from "./components/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import SubscriptionPrompt from "./components/SubscriptionPrompt";
import PaymentCancelled from "./pages/PaymentCancelled";
import CertificateDownload from "./pages/CertificateDownload";
import ForgotPassword from "./pages/ForgotPassword"; // ✅ New import

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [subscription, setSubscription] = useState("Free");
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedRole = localStorage.getItem("userRole");
    const storedSub = localStorage.getItem("subscription");
    const storedExpiry = localStorage.getItem("subscriptionExpiry");

    if (storedUser) {
      setUser(storedUser);
      setRole(storedRole || "user");
      setSubscription(storedSub || "Free");

      if (storedExpiry) {
        const expiryDate = new Date(storedExpiry);
        if (expiryDate < new Date()) {
          setSubscription("Free");
          localStorage.setItem("subscription", "Free");
          localStorage.removeItem("subscriptionExpiry");
        } else {
          setSubscriptionExpiry(storedExpiry);
        }
      }
    }
  }, []);

  const handleLogin = (username) => {
    const storedRole = localStorage.getItem("userRole");
    const storedSub = localStorage.getItem("subscription");
    const storedExpiry = localStorage.getItem("subscriptionExpiry");

    setUser(username);
    setRole(storedRole || "user");
    setSubscription(storedSub || "Free");

    if (storedExpiry) {
      const expiryDate = new Date(storedExpiry);
      if (expiryDate > new Date()) {
        setSubscriptionExpiry(storedExpiry);
      } else {
        setSubscription("Free");
        localStorage.setItem("subscription", "Free");
        localStorage.removeItem("subscriptionExpiry");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("subscription");
    localStorage.removeItem("user");
    localStorage.removeItem("subscriptionExpiry");

    setUser(null);
    setRole("user");
    setSubscription("Free");
    setSubscriptionExpiry(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user}
        role={role}
        subscription={subscription}
        onLogout={handleLogout}
      />
      <main className="flex-grow p-4">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ Added */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancelled" element={<PaymentCancelled />} />
              <Route
                path="/subscription"
                element={
                  <SubscriptionPrompt
                    user={{ username: user }}
                    subscription={subscription}
                    subscriptionExpiry={subscriptionExpiry}
                  />
                }
              />
              <Route path="/certificate" element={<CertificateDownload />} />
              {role === "admin" && (
                <Route path="/admin" element={<AdminDashboard />} />
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

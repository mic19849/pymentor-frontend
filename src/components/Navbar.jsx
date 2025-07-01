// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  let userData = {};
  try {
    userData = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    userData = {};
  }

  const displayName = userData.displayName || userData.username || "U";
  const avatar = userData.avatar || "";
  const role = userData.role || localStorage.getItem("userRole");
  const isPremium = userData.subscription === "Premium";
  const isCompleted = userData.courseCompleted === true;

  const handleLogout = () => {
    onLogout?.();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* 🌐 Top Navbar */}
      <nav className="bg-indigo-600 dark:bg-gray-900 text-white px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* ✅ Logo enlarged */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90">
            <img
              src="/favicon.ico"
              alt="Logo"
              className="w-12 h-12 rounded-2xl shadow-lg object-cover"
            />
            <span className="text-2xl font-extrabold tracking-wide text-white dark:text-yellow-400">
              PyMentor
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* 🌙 Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="text-yellow-300 text-sm px-2"
              title="Toggle dark mode"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>

            {/* 📱 Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* 🖥️ Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="hover:text-yellow-300">Home</Link>
              <Link to="/lessons" className="hover:text-yellow-300">Lessons</Link>
              <Link to="/quiz" className="hover:text-yellow-300">Quiz</Link>
              <Link to="/leaderboard" className="hover:text-yellow-300">Leaderboard</Link>

              {user && isPremium && isCompleted && (
                <Link to="/certificate" className="hover:text-yellow-300">Certificate</Link>
              )}

              {user && isPremium && (
                <Link to="/subscription" className="hover:text-yellow-300">Subscription</Link>
              )}

              {user && role === "admin" && (
                <Link to="/admin" className="hover:text-yellow-300">Admin</Link>
              )}

              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profile">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white text-indigo-700 dark:bg-gray-700 dark:text-white flex items-center justify-center font-bold text-sm">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-semibold px-4 py-1 rounded-full shadow-lg hover:scale-105 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="hover:text-yellow-300">Login</Link>
                  <Link to="/register" className="hover:text-yellow-300">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 Sidebar (mobile) */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-indigo-700 dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-indigo-400 dark:border-gray-700">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white"
          >
            ✖
          </button>
        </div>
        <div className="flex flex-col px-4 py-2 space-y-2 text-white">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          <Link to="/lessons" className="hover:text-yellow-300">Lessons</Link>
          <Link to="/quiz" className="hover:text-yellow-300">Quiz</Link>
          <Link to="/leaderboard" className="hover:text-yellow-300">Leaderboard</Link>

          {user && isPremium && isCompleted && (
            <Link to="/certificate" className="hover:text-yellow-300">Certificate</Link>
          )}

          {user && isPremium && (
            <Link to="/subscription" className="hover:text-yellow-300">Subscription</Link>
          )}

          {user && role === "admin" && (
            <Link to="/admin" className="hover:text-yellow-300">Admin</Link>
          )}

          {user ? (
            <>
              <Link to="/profile" className="hover:text-yellow-300">Profile</Link>
              <button
                onClick={handleLogout}
                className="mt-3 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
              <Link to="/register" className="hover:text-yellow-300">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* 🔳 Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

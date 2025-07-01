import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Certificate from "../components/Certificate";

export default function Home() {
  const [user, setUser] = useState({});
  const [eligible, setEligible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);

    // ✅ Fetch certificate eligibility
    if (userData.username) {
      fetch(`http://localhost:5000/api/certificate/eligible?username=${encodeURIComponent(userData.username)}`)
        .then((res) => res.json())
        .then((data) => setEligible(data.eligible))
        .catch(console.error)
        .finally(() => setChecked(true));
    }

    // ✅ Fetch live progress data
    const fetchProgress = async () => {
      try {
        const progressRes = await fetch(`http://localhost:5000/api/user/progress?username=${encodeURIComponent(userData.username)}`);
        const progressData = await progressRes.json();
        setCompletedLessons(progressData.completedLessons || 0);

        const lessonsRes = await fetch("http://localhost:5000/api/lessons");
        const lessonsData = await lessonsRes.json();
        setTotalLessons(lessonsData.length || 0);
      } catch (err) {
        console.error("Progress fetch error:", err);
      }
    };

    if (userData.username) fetchProgress();
  }, []);

  const subscription = user.subscription || "Free";
  const subscriptionExpiry = user.subscriptionExpiry || null;
  const currentLesson = user.currentLesson || "Introduction to Python";

  const isPremium =
    subscription === "Premium" &&
    subscriptionExpiry &&
    new Date(subscriptionExpiry) > new Date();

  const progress = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const handleDownload = () => {
    window.open(`http://localhost:5000/api/certificate?username=${encodeURIComponent(user.username)}`, "_blank");
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 dark:bg-[#0d0f1c] transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Banner */}
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back, {user.displayName || user.username || "User"} 👋
          </h2>
          {isPremium ? (
            <p className="text-green-600 dark:text-green-400 text-lg font-medium">
              🎉 You're enjoying <span className="font-semibold">Premium access</span> – keep learning!
            </p>
          ) : (
            <div>
              <p className="text-yellow-600 dark:text-yellow-400 text-lg font-medium">
                🔓 You're on a <strong>Free Plan</strong> – unlock all features by upgrading.
              </p>
              <Link
                to="/subscription"
                className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-md transition"
              >
                Upgrade to Premium 🚀
              </Link>
            </div>
          )}
        </div>

        {/* Current Lesson Section */}
        <div className="rounded-xl bg-white dark:bg-[#15182a] border border-gray-200 dark:border-gray-700 shadow p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">📘 Your Current Lesson</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You're learning: <strong>{currentLesson}</strong>
          </p>
          <Link
            to="/lessons"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          >
            Go to Lessons
          </Link>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-2 transition-all duration-700 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-[#141726] dark:to-[#0a0d1a] border border-yellow-300 dark:border-indigo-600 shadow-xl p-6 mb-10 text-center transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            🎓 Certificate of Completion
          </h2>
          {checked ? (
            eligible ? (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Congratulations! You’ve completed the course. 🎉
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2 rounded-md shadow transition"
                  >
                    View Certificate
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-5 py-2 rounded-md shadow transition"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm sm:text-base font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 shadow-sm">
                ❌ Complete all lessons and upgrade to Premium to unlock your certificate.
              </p>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-300">Checking certificate status...</p>
          )}
        </div>

        {/* Embedded Certificate Viewer */}
        {showCertificate && eligible && (
          <div className="max-w-2xl mx-auto mt-6 border border-gray-300 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
            <Certificate />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 <strong>PythonLearn</strong>. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

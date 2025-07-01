import React, { useEffect, useState } from "react";

const Certificate = () => {
  const [user, setUser] = useState(null);
  const [certId, setCertId] = useState("");
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);

    if (userData?.username) {
      const hash = btoa(userData.username + new Date().getFullYear())
        .slice(0, 10)
        .toUpperCase();
      setCertId(`PYL-${hash}`);

      Promise.all([
        fetch("http://localhost:5000/api/lessons").then((res) => res.json()),
        fetch(`http://localhost:5000/api/user/progress?username=${userData.username}`).then((res) =>
          res.json()
        ),
      ])
        .then(([lessons, progress]) => {
          const total = lessons.length;
          const completed = progress.completedLessons || 0;
          setEligible(
            userData.subscription === "Premium" &&
              new Date(userData.subscriptionExpiry) > new Date() &&
              completed >= total
          );
        })
        .catch((err) => console.error("Error checking eligibility:", err))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleDownload = () => {
    window.open(
      `http://localhost:5000/api/certificate?username=${encodeURIComponent(
        user.displayName || user.username
      )}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-white">
        Checking eligibility...
      </p>
    );
  }

  if (!eligible) {
    return (
      <div className="text-center mt-10 text-red-600 dark:text-red-400 font-semibold text-lg px-4">
        ❌ You must complete the full course with an active Premium subscription to access your certificate.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-gradient-to-br from-white to-blue-50 dark:from-[#0f1124] dark:to-[#1e2544] border-2 border-purple-500 dark:border-purple-400 rounded-2xl shadow-2xl text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-yellow-300">
        🎓 Certificate of Completion
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-200">This certifies that</p>

      <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-700 dark:text-indigo-300 mt-2">
        {user.displayName || user.username}
      </h2>

      <p className="mt-3 text-lg text-gray-800 dark:text-gray-300">
        has successfully completed the full Python course.
      </p>

      <p className="mt-5 text-sm text-gray-600 dark:text-gray-400">
        Issued by <strong>PythonLearn</strong> · {new Date().getFullYear()}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Certificate ID: <code className="font-mono">{certId}</code>
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          🖨️ Print Certificate
        </button>
        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          ⬇ Download PDF
        </button>
      </div>
    </div>
  );
};

export default Certificate;

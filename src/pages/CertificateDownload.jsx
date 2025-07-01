import React, { useState, useEffect } from "react";
import Certificate from "../components/Certificate";

export default function CertificateDownload() {
  const [username, setUsername] = useState("");
  const [eligible, setEligible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.username) return;

    setUsername(user.username);

    fetch(
      `http://localhost:5000/api/certificate/eligible?username=${encodeURIComponent(
        user.username
      )}`
    )
      .then((res) => res.json())
      .then((data) => setEligible(data.eligible))
      .catch(console.error)
      .finally(() => setChecked(true));
  }, []);

  const handleShow = () => setShowCertificate(true);
  const handleDownload = () => {
    window.open(
      `http://localhost:5000/api/certificate?username=${encodeURIComponent(
        username
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0f1a] py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-800 dark:text-white">
          🎓 Certificate of Completion
        </h1>

        {checked ? (
          eligible ? (
            <>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button
                  onClick={handleShow}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
                >
                  👁️ View Certificate
                </button>

                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
                >
                  ⬇️ Download PDF
                </button>
              </div>

              {showCertificate && (
                <div className="mt-10 bg-gradient-to-br from-[#fefefe] to-[#f9fafc] dark:from-[#10151f] dark:to-[#1a2130] border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-2xl transition-all">
                  <Certificate name={username} />
                </div>
              )}
            </>
          ) : (
            <p className="text-red-600 dark:text-red-400 mt-6 text-lg font-medium">
              ❌ You must complete the full course with a Premium subscription to access your certificate.
            </p>
          )
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Checking eligibility...</p>
        )}
      </div>
    </div>
  );
}

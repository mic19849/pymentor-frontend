import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    displayName: "",
    subscription: "",
    subscriptionExpiry: "",
    avatar: "",
    courseCompleted: false,
  });

  const [editName, setEditName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasChangedName, setHasChangedName] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData({
      username: user.username || "",
      displayName: user.displayName || user.username || "",
      subscription: user.subscription || "Free",
      subscriptionExpiry: user.subscriptionExpiry || "",
      avatar: user.avatar || "",
      courseCompleted: user.courseCompleted || false,
    });
    setEditName(user.displayName || user.username || "");
    setAvatarPreview(user.avatar || "");
    setHasChangedName(!!user.displayName && user.displayName !== user.username);
  }, []);

  const handleNameSubmit = async () => {
    if (!editName.trim()) {
      setMessage("⚠️ Display name cannot be blank.");
      return;
    }
    if (hasChangedName) {
      setMessage("❌ You can only change your display name once.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/user/display-names", {
        headers: { "x-username": userData.username },
      });
      const allUsers = await res.json();
      const nameTaken = allUsers.find(
        (u) =>
          u.displayName?.toLowerCase() === editName.toLowerCase() &&
          u.username !== userData.username
      );
      if (nameTaken) {
        setMessage("❌ That display name is already taken.");
        return;
      }

      const updated = { ...userData, displayName: editName };
      setUserData(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setHasChangedName(true);

      await fetch("http://localhost:5000/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: updated.username,
          displayName: editName,
        }),
      });

      setMessage("✅ Name updated and synced!");
    } catch (err) {
      setMessage("❌ Something went wrong while updating name.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const updated = { ...userData, avatar: reader.result };
        setAvatarPreview(reader.result);
        setUserData(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        await fetch("http://localhost:5000/api/user/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: updated.username,
            avatar: reader.result,
          }),
        });
        setMessage("✅ Avatar updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const isPremium =
    userData.subscription === "Premium" &&
    userData.subscriptionExpiry &&
    new Date(userData.subscriptionExpiry) > new Date();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8 transition-all">
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-indigo-600 dark:text-yellow-400">
          👤 Your Profile
        </h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-3xl text-white shadow-md">
              ?
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* Display Name Update */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Display Name
          </label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            disabled={hasChangedName}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleNameSubmit}
            disabled={loading || hasChangedName}
            className="mt-4 w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50"
          >
            {hasChangedName ? "Name Change Done ✅" : loading ? "Updating..." : "Update Name"}
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl text-sm text-gray-800 dark:text-gray-200 mb-6 shadow-sm">
          <p>
            <strong>Username:</strong> {userData.username}
            {userData.courseCompleted && (
              <span className="ml-2 text-green-500 font-medium">🎓 Certified</span>
            )}
          </p>
          <p>
            <strong>Subscription:</strong>{" "}
            <span className={isPremium ? "text-green-600 dark:text-green-400 font-semibold" : ""}>
              {userData.subscription}
            </span>
          </p>
          {isPremium && userData.subscriptionExpiry && (
            <p className="text-green-600 dark:text-green-400">
              ✅ Valid till:{" "}
              {new Date(userData.subscriptionExpiry).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Certificate Section */}
        {isPremium && userData.courseCompleted && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white p-6 rounded-2xl text-center shadow-lg mb-6">
            <h3 className="text-xl font-bold mb-2">🎓 Course Completed</h3>
            <p className="text-sm mb-4">You're eligible to view your certificate.</p>
            <Link
              to="/certificate"
              className="inline-block bg-white text-green-700 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              View Certificate
            </Link>
          </div>
        )}

        {/* Feedback Message */}
        {message && (
          <div className="mt-4 text-center py-2 px-4 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 shadow">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

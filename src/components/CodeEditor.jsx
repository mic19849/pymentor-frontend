import React, { useEffect, useState } from "react";

export default function CodeEditor() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleCopyToEditor = (e) => {
      const copiedCode = e.detail?.code || "";
      setCode(copiedCode);
    };

    window.addEventListener("copy-to-editor", handleCopyToEditor);
    return () => window.removeEventListener("copy-to-editor", handleCopyToEditor);
  }, []);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Invalid server response:\n" + text);
      }

      const data = await res.json();

      if (res.ok) {
        setOutput(data.output || "✅ Code ran successfully.");
      } else {
        setOutput(data.error || "⚠️ Unknown error occurred.");
      }
    } catch (err) {
      setOutput(err.message || "⚠️ Could not execute code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#10121c] text-black dark:text-white p-6 rounded-xl shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">
        ⚙️ Python Code Editor
      </h3>

      <textarea
        rows={10}
        className="w-full p-3 rounded-lg border dark:border-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-[#181c2a] dark:text-white text-sm resize-none"
        placeholder="# Write your Python code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={runCode}
        disabled={loading || !code.trim()}
        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
      >
        {loading ? "Running..." : "▶️ Run Code"}
      </button>

      <div className="mt-6">
        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">🧾 Output:</h4>
        <pre className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg max-h-64 overflow-auto whitespace-pre-wrap border border-gray-300 dark:border-gray-700">
          {output || "No output yet..."}
        </pre>
      </div>
    </div>
  );
}

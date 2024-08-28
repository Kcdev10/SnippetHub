"use client";
import { useState } from "react";

export default function CodeSnippet() {
  const [snippet, setSnippet] = useState("");
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-black">
        <h1 className="text-2xl font-bold mb-4">Code Snippet Sharer</h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={10}
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          placeholder="Paste your code snippet here..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Share Snippet
        </button>
      </div>
    </div>
  );
}

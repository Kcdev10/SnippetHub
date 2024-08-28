"use client";
import { useState } from "react";
import axios from "axios";

export default function SnippetForm() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8055/api/v1/snippets", {
        code,
      });
      // Clear form
      setTitle("");
      setCode("");
      setLanguage("");
    } catch (error) {
      console.error("Error adding snippet:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add a New Snippet</h2>
        {/* <div className="mb-2">
          <label className="block mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div> */}
        <div className="mb-2">
          <label className="block mb-1">Code:</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={20}
            className="border rounded w-full p-2"
            required
          />
        </div>
        {/* <div className="mb-2">
          <label className="block mb-1">Language:</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div> */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Snippet
        </button>
      </form>
    </div>
  );
}

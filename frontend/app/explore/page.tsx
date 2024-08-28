"use client";
import SnippetCard from "@/components/snippet-card";
import { useAppSelector } from "@/hooks/reduxHooks";

export default function Page() {
  const { publicCodeSnippet } = useAppSelector((state) => state.codeSnippet);
  return (
    <div className="max-w-7xl mx-auto mt-24">
      <div className="w-full relative">
        <input
          type="text"
          placeholder="search snippet here...."
          className="outline-none w-full border border-gray-300 px-4 py-3 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {publicCodeSnippet.map((snippet, index) => (
          <SnippetCard
            {...snippet}
            index={index}
            key={index}
            showEditDelete={false}
          />
        ))}
      </div>
    </div>
  );
}

"use client";
import { useAppSelector } from "@/hooks/reduxHooks";
import SnippetCard from "./snippet-card";

export default function SnippetDisplay() {
  const { codeSnippet } = useAppSelector((state) => state.codeSnippet);

  return (
    <div>
      <h1 className="text-3xl font-medium text-gray-600 mb-4 flex items-center gap-2 px-5">
        Snippet Gallery{" "}
        <span className="text-sm font-normal">
          || Explore and Manage Your Code Collection
        </span>
      </h1>

      <ul className="grid md:grid-cols-2 gap-3 mt-8">
        {codeSnippet?.map((snippet, index) => {
          return (
            <SnippetCard
              {...snippet}
              index={index}
              key={index}
              showEditDelete={true}
            />
          );
        })}
      </ul>
    </div>
  );
}

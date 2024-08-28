"use client";
import { useEffect, useState } from "react";
import axios from "axios";
// import Prism from "prismjs";
// import "prismjs/components/prism-javascript";
import { useAppSelector } from "@/hooks/reduxHooks";
import { FaRegCopy } from "react-icons/fa";
import { BsFillPatchCheckFill } from "react-icons/bs";
import SnippetCard from "./snippet-card";

export default function SnippetDisplay() {
  const { codeSnippet } = useAppSelector((state) => state.codeSnippet);
  const [isCopiedIndex, setIsCopiedIndex] = useState(-1);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(
      () => {},
      (err) => console.error("Failed to copy code:", err)
    );
  };

  // useEffect(() => {
  //   Prism.highlightAll();
  // }, [codeSnippet]);

  return (
    <div>
      <h1 className="text-3xl font-medium text-gray-600 mb-4 flex items-center gap-2 px-5">
        Snippet Gallery{" "}
        <span className="text-sm font-normal">
          || Explore and Manage Your Code Collection
        </span>
      </h1>
      {/* <SnippetComponent snippet={snippets}/> */}
      {/* <ul className="grid grid-cols-2 gap-3 mt-8">
        {codeSnippet?.map((snippet, index) => {
          return (
            <li
              key={snippet._id}
              className="mb-4 px-6 py-3 border rounded shadow h-96 overflow-auto"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-[15px] font-bold ">{snippet.title}</h2>
                <button
                  onClick={() => {
                    handleCopy(snippet.code);
                    setIsCopiedIndex(index);
                  }}
                  className="px-4 py-2 bg-gray-200 text-white rounded"
                  title="Copy code"
                >
                  {index === isCopiedIndex ? (
                    <BsFillPatchCheckFill size={20} className="text-black/80" />
                  ) : (
                    <FaRegCopy size={20} className="text-black/80" />
                  )}
                </button>
              </div>
              <pre className={`language-javascript`}>
                <code>{snippet.code}</code>
              </pre>
            </li>
          );
        })}
      </ul> */}

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

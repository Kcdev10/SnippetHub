"use client";
import SnippetCard from "@/components/snippet-card";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useMemo, useState } from "react";

export default function Page() {
  const { publicCodeSnippet } = useAppSelector((state) => state.codeSnippet);
  const [searchText, setSearchText] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const debouncedSearch = (value: string) => {
    setSearchText(value);
    setIsSearch(true);
  };

  // Filter snippets based on search text
  const filteredSnippets = useMemo(() => {
    return publicCodeSnippet.filter((snippet) =>
      snippet.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, publicCodeSnippet]);

  return (
    <div className="max-w-7xl mx-auto mt-28 md:px-0 px-4">
      <div className="w-full relative">
        <input
          type="text"
          placeholder="search snippet here...."
          className="outline-none w-full border border-gray-300 px-4 py-3 rounded-md"
          onChange={(e) => debouncedSearch(e.target.value)}
        />

        {/* <div className="absolute top-[95%] rounded-b-md left-0 w-full p-2 bg-gray-100 shadow-lg">
             {filteredSnippets.map((item)=>)}
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {!isSearch &&
          publicCodeSnippet.map((snippet, index) => (
            <SnippetCard
              {...snippet}
              index={index}
              key={index}
              showEditDelete={false}
            />
          ))}

        {isSearch &&
          filteredSnippets.map((snippet, index) => (
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

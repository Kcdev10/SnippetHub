import FolderList from "@/components/folder-list";
import SnippetDisplay from "@/components/snippet-display";
import React from "react";

export default function page() {
  return (
    <section>
      <div className="grid xl:grid-cols-12 h-screen mt-20">
        <div className="xl:col-span-2 h-screen overflow-auto p-4 bg-[#F4F4F4] shadow-2xl">
          <FolderList />
        </div>

        <div className="xl:col-span-10 h-screen overflow-auto p-6 bg-white shadow-xl">
          <SnippetDisplay />
        </div>
      </div>
    </section>
  );
}

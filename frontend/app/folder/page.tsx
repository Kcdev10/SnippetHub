import FolderList from "@/components/folder-list";
import SnippetDisplay from "@/components/snippet-display";
import React from "react";

export default function page() {
  return (
    <section>
      <div className="grid md:grid-cols-12 h-screen mt-20 bg-red-500">
        <div className="md:col-span-4 h-screen overflow-auto p-4 bg-[#F4F4F4] shadow-2xl">
          <FolderList />
        </div>

        <div className="md:col-span-8 h-screen overflow-auto p-6 bg-white shadow-xl">
          <SnippetDisplay />
        </div>
      </div>
    </section>
  );
}

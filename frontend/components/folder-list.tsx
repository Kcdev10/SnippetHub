"use client";

// components/FolderList.tsx
import React, { useEffect, useState } from "react";
import Folder from "./folder";
import { FaFolderPlus } from "react-icons/fa";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchFolder } from "@/redux/slices/folderSlice";
import { fetchCodeSnippet } from "@/redux/slices/codeSnippetSlice";
import { getRandomHexColor } from "@/utils/getRandomColor";

export interface IFolder {
  _id: string;
  name: string;
  parentId: string;
  subfolders: IFolder[];
}

const FolderList: React.FC = () => {
  const [showInput, setShowInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const dispatch = useAppDispatch();
  const { folders } = useAppSelector((state) => state.folder);

  const addFolder = async () => {
    if (newFolderName.trim() === "") return;
    try {
      const { data } = await axios.post(
        "http://localhost:8055/api/v1/folder/create",
        {
          name: newFolderName,
          parentId: null, // Use the parentId if creating a subfolder
        },
        {
          withCredentials: true,
        }
      );
      setNewFolderName("");
      setShowInput(false);
      dispatch(fetchFolder());
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleSelectFolder = async (folderId: string) => {
    dispatch(fetchCodeSnippet(folderId));
  };

  useEffect(() => {
    dispatch(fetchFolder());
    dispatch(
      fetchCodeSnippet(localStorage.getItem("lastOpenFolderId") as string)
    );
  }, [dispatch]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-[#2C3E50]">Folders</h2>
        <FaFolderPlus
          size={22}
          className="cursor-pointer text-[#3498DB]"
          onClick={() => setShowInput(!showInput)}
        />
      </div>

      {showInput && (
        <div className="mt-2 ml-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder Name"
            className="px-4 py-1 outline-none border border-green-500/20 rounded-sm text-sm"
          />
          <button
            onClick={addFolder}
            className="text-sm font-bold ml-2 border py-1 px-4 rounded-sm"
          >
            Add
          </button>
        </div>
      )}

      <div className="mt-4 space-y-5">
        {folders?.map((folder, index) => (
          <Folder key={index} {...folder} onSelect={handleSelectFolder} />
        ))}
      </div>
    </div>
  );
};

export default FolderList;

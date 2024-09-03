"use client";
// components/Folder.tsx
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchFolder, selectFolder } from "@/redux/slices/folderSlice";
import axios from "axios";
import React, { useState } from "react";
import { FaCode, FaFolderPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IFolder } from "./folder-list";
import { fetchCodeSnippet } from "@/redux/slices/codeSnippetSlice";

interface ICodeSnippet {
  _id: string;
  title: string;
  code: string;
}

interface IFolderProps extends IFolder {
  onSelect: (folderId: string) => void;
}

const Folder: React.FC<IFolderProps> = ({
  name,
  subfolders,
  _id,
  onSelect,
}) => {
  // const [subfolders, setSubfolders] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showSubFolder, setShowSubFolder] = useState(true);
  const [codeSnippetPrivacyValue, setCodeSnippetPrivacyValue] =
    useState("public");

  const [showCodeSnippetInput, setShowCodeSnippetInput] = useState(false);
  const [newCodeSnippetTitle, setNewCodeSnippetTitle] = useState("");
  const [newCodeSnippetCode, setNewCodeSnippetCode] = useState("");

  const dispatch = useAppDispatch();
  const { selectedFolderId } = useAppSelector((state) => state.folder);
  const isActive = selectedFolderId === _id;

  const addSubfolder = async () => {
    if (newFolderName.trim() === "") return;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/folder/create`,

        {
          name: newFolderName,
          parentId: _id,
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

  const addCodeSnippet = async () => {
    if (newCodeSnippetTitle.trim() === "" || newCodeSnippetCode.trim() === "") {
      alert("please fill the required field");
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/code-snippet/create`,
        {
          title: newCodeSnippetTitle,
          code: newCodeSnippetCode,
          folderId: _id,
          isPublic: codeSnippetPrivacyValue,
        }
      );
      setNewCodeSnippetTitle("");
      setNewCodeSnippetCode("");
      setShowCodeSnippetInput(false);
      dispatch(
        fetchCodeSnippet(localStorage.getItem("lastOpenFolderId") as string)
      );
      alert(data.message);
    } catch (error) {
      console.error("Error creating code snippet:", error);
    }
  };

  const deleteFolder = async (folderId: string) => {
    const confirm = window.confirm("you want to delete! Are you sure");
    if (confirm) {
      try {
        const { data } = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/folder/delete/${folderId}`,
          {
            withCredentials: true,
          }
        );
        setShowCodeSnippetInput(false);
        alert(data.message);
        dispatch(fetchFolder());
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="ml-4 border-b-2 border-b-blue-100 pb-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <FaFolderPlus
            size={18}
            onClick={() => setShowInput(!showInput)}
            className="cursor-pointer  text-[#3498DB]"
            title="Add Folder"
          />
          <div onClick={() => deleteFolder(_id)}>
            <MdDeleteOutline
              size={18}
              className="text-red-400 cursor-pointer"
            />
          </div>
          <strong
            className={`cursor-pointer  duration-500 px-1 rounded-sm  ${isActive ? " text-white bg-[#317a9c]" : "bg-white text-[#2C3E50]"}`}
            // style={{ background: selecteFolderId == _id ? "#3498DB" : "" }}
            onClick={() => {
              setShowSubFolder(!showSubFolder);
              dispatch(selectFolder(_id));
              onSelect(_id);
            }}
          >
            {name}
          </strong>
        </div>

        <button
          onClick={() => setShowCodeSnippetInput(!showCodeSnippetInput)}
          className="ml-2  text-sm font-bold text-[#2C3E50]"
        >
          <FaCode size={14} />
        </button>
      </div>

      {showInput && (
        <div className="mt-2 ml-4 relative">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder Name"
            className="px-4 py-1 outline-none border border-green-500/20 rounded-sm text-sm w-full"
          />
          <button
            onClick={addSubfolder}
            className="text-sm font-bold ml-2 border py-1 px-4 rounded-sm absolute top-0 right-0 z-20 bg-white shadow-xl"
          >
            Add
          </button>
        </div>
      )}

      {showCodeSnippetInput && (
        <div className="mt-4 flex flex-col gap-2 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1/2 mx-auto bg-gray-200 p-2">
          <div
            className="flex justify-end font-bold px-2 cursor-pointer"
            onClick={() => setShowCodeSnippetInput(!showCodeSnippetInput)}
          >
            X
          </div>

          <div className="relative border">
            <input
              type="text"
              required
              value={newCodeSnippetTitle}
              onChange={(e) => setNewCodeSnippetTitle(e.target.value)}
              placeholder="Snippet Title"
              className="px-4 py-2 w-full outline-none border border-blue-500/20 rounded-sm text-sm"
            />
            <select
              className="absolute top-1/2 -translate-y-1/2 right-2 border outline-none px-2 text-sm"
              onChange={(e) => setCodeSnippetPrivacyValue(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <textarea
            value={newCodeSnippetCode}
            rows={20}
            required
            onChange={(e) => setNewCodeSnippetCode(e.target.value)}
            placeholder="Code Snippet"
            className="px-4 py-2 outline-none border border-blue-500/20 rounded-sm text-sm mt-1"
          />

          <button
            onClick={addCodeSnippet}
            className="text-sm font-bold ml-2 border py-3 rounded-sm px-4 rounded-sm bg-orange-400 text-white"
          >
            Add Snippet
          </button>
        </div>
      )}

      {showSubFolder && subfolders?.length > 0 && (
        <div className="space-y-4 mt-4">
          {subfolders.map((subfolder, index) => (
            <Folder key={index} {...subfolder} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Folder;

"use client";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import { useEffect, useState } from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { fetchCodeSnippet } from "@/redux/slices/codeSnippetSlice";
import Link from "next/link";

export interface ISnippetType {
  _id: string;
  code: string;
  title: string;
  index: number;
  showEditDelete: boolean;
}

export default function SnippetCard({
  code,
  title,
  _id,
  index,
  showEditDelete,
}: ISnippetType) {
  const [isCopiedIndex, setIsCopiedIndex] = useState(-1);
  const [codeSnippetPrivacyValue, setCodeSnippetPrivacyValue] =
    useState("public");

  const [showCodeSnippetInput, setShowCodeSnippetInput] = useState(false);
  const [newCodeSnippetTitle, setNewCodeSnippetTitle] = useState(title);
  const [newCodeSnippetCode, setNewCodeSnippetCode] = useState(code);
  const dispatch = useAppDispatch();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(
      () => {},
      (err) => console.error("Failed to copy code:", err)
    );
  };

  const handleSnippetDelete = async (snippetId: string) => {
    const confirm = window.confirm("you want to delete! Are you sure");
    if (confirm) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/code-snippet/delete/${snippetId}`,
          {
            withCredentials: true,
          }
        );
        dispatch(
          fetchCodeSnippet(localStorage.getItem("lastOpenFolderId") as string)
        );
      } catch (error) {}
    }
  };

  const updateCodeSnippet = async (snippetId: string) => {
    if (newCodeSnippetTitle.trim() === "" || newCodeSnippetCode.trim() === "") {
      alert("please fill the required field");
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/code-snippet/update/${snippetId}`,
        {
          title: newCodeSnippetTitle,
          code: newCodeSnippetCode,
          folderId: localStorage.getItem("lastOpenFolderId"),
          isPublic: codeSnippetPrivacyValue,
        }
      );
      dispatch(
        fetchCodeSnippet(localStorage.getItem("lastOpenFolderId") as string)
      );
      setShowCodeSnippetInput(false);
      console.log(data);
    } catch (error) {
      console.error("Error creating code snippet:", error);
    }
  };

  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div
      key={_id}
      className="mb-4 px-6 py-3 border rounded shadow h-96 overflow-auto"
    >
      <div className="flex gap-2 items-center justify-end">
        <button
          onClick={() => {
            handleCopy(code);
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

        {showEditDelete && (
          <div
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
            onClick={() => {
              setShowCodeSnippetInput(!showCodeSnippetInput);
              setNewCodeSnippetCode(code);
              setNewCodeSnippetTitle(title);
            }}
          >
            <CiEdit size={20} />
          </div>
        )}

        {showEditDelete && (
          <div
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
            onClick={() => handleSnippetDelete(_id)}
          >
            <MdOutlineDelete size={20} />
          </div>
        )}
      </div>

      <div className="flex md:flex-row flex-col gap-4 justify-between items-center mt-5">
        <h2 className="text-[15px] font-bold ">{title}</h2>
      </div>

      <Link href={`/code-snippet?q=${_id}`}>
        <pre className={`language-javascript w-full`}>
          <code>{code}</code>
        </pre>
      </Link>

      {showCodeSnippetInput && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center mt-10">
          <div className="mt-4 flex flex-col gap-2 w-1/2 mx-auto p-5 border bg-gray-200">
            <span
              className="flex justify-end font-bold cursor-pointer"
              onClick={() => setShowCodeSnippetInput(!showCodeSnippetInput)}
            >
              X
            </span>
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
              onClick={() => updateCodeSnippet(_id)}
              className="text-sm font-bold ml-2 border py-3 px-4 rounded-sm bg-orange-400 text-white"
            >
              Update Snippet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

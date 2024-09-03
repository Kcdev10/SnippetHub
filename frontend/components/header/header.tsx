"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchCodeSnippet,
  fetchPublicCodeSnippet,
} from "@/redux/slices/codeSnippetSlice";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { fetchUserDetails } from "@/redux/slices/userSlice";
import { VscCode } from "react-icons/vsc";
import { CiMail, CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import Cookies from "js-cookie";

const snippetHubLogoImage = "/images/sh-transparent.png";

export default function Header() {
  const dispatch = useAppDispatch();
  const [dialogBox, setDialogBos] = useState(false);
  const { userDetails, authenticate } = useAppSelector((state) => state.user);
  const refDialabox = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchPublicCodeSnippet());
    dispatch(fetchUserDetails());

    function handleClickOutside(event: MouseEvent) {
      if (
        refDialabox.current &&
        !refDialabox.current?.contains(event.target as Node)
      ) {
        setDialogBos(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);
  return (
    <header className="bg-gray-900 py-3 text-white fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href={"/"} className="text-2xl font-bold flex items-center">
          <img
            src={snippetHubLogoImage}
            alt="snippet-hub-logo"
            className="object-cover w-12"
          />
        </Link>

        <nav className="flex md:gap-8 gap-2 items-center">
          <Link href="/" className=" hover:text-gray-400 md:text-lg text-sm">
            Home
          </Link>

          <Link
            href="/explore"
            className=" hover:text-gray-400 md:text-lg text-sm"
          >
            Explore
          </Link>

          {authenticate && (
            <Link
              href={"/folder"}
              className="hover:text-gray-400 flex items-center gap-2 md:text-lg text-sm"
            >
              Snippet <VscCode size={26} />
            </Link>
          )}

          {authenticate && (
            <div
              className="w-10 h-10 bg-white rounded-full cursor-pointer relative md:ml-4"
              onClick={() => setDialogBos(!dialogBox)}
            >
              <span className="flex items-center justify-center text-gray-600 text-3xl font-bold">
                {" "}
                {userDetails?.username.split("")[0]}
              </span>

              <div
                ref={refDialabox}
                className="absolute top-[138%] rounded-sm w-auto bg-gray-200 shadow-lg transition-all duration-200 origin-top z-30"
                style={{
                  transform: dialogBox
                    ? "translateX(-70%) scaleY(1)"
                    : "translateX(-70%) scaleY(0)",
                }}
              >
                <div className="text-sm text-gray-600 capitalize flex flex-col">
                  <p className="py-2 px-2 hover:bg-gray-300 duration-500 border-b-gray-300 border lowercase flex items-center gap-1">
                    <CiMail size={18} /> {userDetails?.email}
                  </p>

                  <div
                    className="py-2 px-2 hover:bg-gray-300 duration-500 cursor-pointer flex items-center gap-1"
                    onClick={() => {
                      Cookies.remove("auth_user_access_token", { path: "/" });
                      localStorage.removeItem("lastOpenFolderId");
                      localStorage.removeItem("auth_user_access_token");
                      dispatch(fetchUserDetails());
                    }}
                  >
                    <IoIosLogOut size={18} /> Logout
                  </div>
                </div>
              </div>
            </div>
          )}

          {!authenticate && (
            <Link
              href="/auth/login"
              className="hover:text-gray-400 md:text-lg text-sm"
            >
              Login
            </Link>
          )}

          {!authenticate && (
            <Link
              href="/auth/register"
              className="hover:text-gray-400 md:text-lg text-sm"
            >
              Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

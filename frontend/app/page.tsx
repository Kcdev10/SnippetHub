// pages/Home.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchPublicCodeSnippet } from "@/redux/slices/codeSnippetSlice";
import SnippetCard from "@/components/snippet-card";

const heroVideo = "/video/snippethub.mp4";

const Home: React.FC = () => {
  const { publicCodeSnippet } = useAppSelector((state) => state.codeSnippet);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Full-Screen Hero Section */}
      <div className="relative bg-cover bg-center md:h-screen h-[60vh] flex items-center justify-center text-center text-white mt-16">
        <div className="absolute w-full h-full left-0 top-0">
          <video
            className="w-full h-full object-cover "
            src={heroVideo}
            muted
            autoPlay
            loop
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 md:max-w-4xl w-full mx-auto p-4 flex flex-col gap-8 items-center">
          <h1 className="text-3xl font-bold md:text-5xl">
            Organize and Access Your Code Snippets Effortlessly
          </h1>

          <p className="md:text-xl">
            Save, categorize, and quickly find your code snippets with our
            user-friendly platform. Perfect for developers who want to keep
            their code organized and accessible.
          </p>

          <Link
            href="/folder"
            className="bg-blue-600 hover:bg-blue-700 text-white md:px-8 md:py-4 px-4 py-3 rounded-lg md:text-lg text-sm font-semibold transition"
          >
            Get Started
          </Link>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-black/25" />
      </div>

      {/* Public Code Snippets Section */}
      <section className="py-16 bg-gray-100">
        <div className="px-6 md:px-12 space-y-4">
          <h2 className="text-4xl font-bold text-center">
            Explore Public Code Snippets
          </h2>
          <p className="text-lg text-center">
            Browse through publicly available code snippets. Use them for
            inspiration or reference in your own projects.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          {publicCodeSnippet.slice(0, 4).map((snippet, index) => (
            <SnippetCard
              {...snippet}
              index={index}
              key={index}
              showEditDelete={false}
            />
          ))}
        </div>

        <div className="flex justify-center items-center mt-10">
          <Link
            href={"/explore"}
            className="bg-blue-600 hover:bg-blue-700 text-white md:px-8 md:py-4 px-4 py-3 rounded-lg md:text-lg text-sm font-semibold transition"
          >
            Explore more
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="mb-2">© 2024 SnippetHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

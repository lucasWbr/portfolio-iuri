"use client";
import { list } from "../data/itemsList";
import React, { useState } from "react";
import currentPath from "path";
import Link from "next/link";

function Navbar() {
  const tags = list.map((item) => item.tags);
  const uniqueTags = tags
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);

  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const toggleTray = () => {
    setIsTrayOpen(!isTrayOpen);
  };

  return (
    <div className="bg-black h-16">
      <section className="mx-auto max-w-7xl">
        <div>
          <ul className="justify-between items-center h-16 hidden md:flex">
            <Link href="/" passHref>
              <li className="text-white">HOME</li>
            </Link>
            {uniqueTags.map((tag) => (
              <Link key={tag} href={`/${tag}`} passHref>
                <li
                  key={tag}
                  className="inline-block px-2 py-1 text-white uppercase hover:bg-white cursor-pointer"
                >
                  {tag}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="flex md:hidden justify-center items-center h-16">
          <div>
            <h1 className="text-white">logo</h1>
          </div>
          <button
            onClick={toggleTray}
            className="text-white uppercase hover:bg-white cursor-pointer absolute right-4 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isTrayOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        {isTrayOpen && (
          <div className="md:hidden bg-black">
            <ul className="flex flex-col items-center">
              <Link href="/" passHref>
                <li className="text-white">HOME</li>
              </Link>
              {uniqueTags.map((tag) => (
                <Link key={tag} href={`/${tag}`} passHref>
                  <li
                    key={tag}
                    className="px-2 py-1 text-white uppercase hover:bg-white cursor-pointer"
                  >
                    {tag}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
export default Navbar;

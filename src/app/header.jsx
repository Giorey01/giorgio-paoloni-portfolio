"use client";
import { FaInstagram } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-7 mt-4 h-10 w-full">
        <a
          href="https://www.instagram.com/_jojifilm_/"
          rel="noopener noreferrer"
        >
          <FaInstagram className="scale-150 cursor-pointer" />
        </a>
        <RxHamburgerMenu
          className="scale-150 cursor-pointer"
          onClick={() => setIsNavOpen((prev) => !prev)}
        />
      </div>

      <div
        className={`absolute w-full h-full top-0 left-0 bg-white flex flex-col justify-evenly items-center z-10 transition-opacity duration-300 ${
          isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed top-0 flex items-center justify-between px-7 mt-4 h-10 w-full"
          onClick={() => setIsNavOpen(false)}
        >
          <a
            href="https://www.instagram.com/_jojifilm_/"
            rel="noopener noreferrer"
          >
            <FaInstagram className="scale-150 cursor-pointer" />
          </a>
          <RxCross2 className="cursor-pointer scale-150" />
        </div>
        <ul className="flex flex-col items-center justify-center  min-h-[250px] text-2xl">
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/" onClick={() => setIsNavOpen(false)}>
              Home
            </Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/about" onClick={() => setIsNavOpen(false)}>
              About
            </Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/portfolio" onClick={() => setIsNavOpen(false)}>
              Portfolio
            </Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/blog" onClick={() => setIsNavOpen(false)}>
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;

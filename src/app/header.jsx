"use client";
import { FaInstagram } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import React, { useState } from "react";
import Link from "next/link";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      {/* Navbar per versioni desktop */}
      <div className="flex items-center justify-between p-7 mt-4 h-10 w-11/12 border-2 border-[#2F3645] border-opacity-60 rounded-3xl bg-[#e8e6e3] bg-opacity-90">
        <Link
          href="https://www.instagram.com/_jojifilm_/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaInstagram className="scale-150 cursor-pointer hover:opacity-45 transition-all" />
        </Link>
        <button
          aria-expanded={isNavOpen}
          className="scale-150 cursor-pointer h-16 md:hidden hover:opacity-45 transition-all"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <RxHamburgerMenu />
        </button>
        <div className="hidden md:flex space-x-4 gap-5">
          <Link
            href="/"
            className="hover:text-gray-700 hover:scale-110 transition-all"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-700 hover:scale-110 transition-all"
          >
            About
          </Link>
          <Link
            href="/portfolio"
            className="hover:text-gray-700 hover:scale-110 transition-all"
          >
            Portfolio
          </Link>
          <Link
            href="/blog"
            className="hover:text-gray-700 hover:scale-110 transition-all"
          >
            Blog
          </Link>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-[#EEEDEB] flex flex-col justify-center items-center z-50 transform transition-transform duration-300 md:hidden ${
          isNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute top-0 flex items-center justify-between px-7 mt-4 w-full h-10"
          onClick={() => setIsNavOpen(false)}
        >
          <Link
            href="https://www.instagram.com/_jojifilm_/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaInstagram className="scale-150 cursor-pointer" />
          </Link>
          <button
            className="scale-150 cursor-pointer"
            onClick={() => setIsNavOpen(false)}
          >
            <RxCross2 />
          </button>
        </div>
        <ul className="flex flex-col items-center justify-center min-h-[250px] text-2xl">
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

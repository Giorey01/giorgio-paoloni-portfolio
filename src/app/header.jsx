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
      <div className="hidden md:flex items-center justify-between px-7 py-4 mt-4 h-10 w-full">
        <Link
          href="https://www.instagram.com/_jojifilm_/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaInstagram className="scale-150 cursor-pointer" />
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-700">
            About
          </Link>
          <Link href="/portfolio" className="hover:text-gray-700">
            Portfolio
          </Link>
          <Link href="/blog" className="hover:text-gray-700">
            Blog
          </Link>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className="md:hidden flex items-center justify-between px-7 mt-4 h-10 w-full">
        <Link
          href="https://www.instagram.com/_jojifilm_/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaInstagram className="scale-150 cursor-pointer" />
        </Link>
        <button
          aria-expanded={isNavOpen}
          className="scale-150 cursor-pointer h-16"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <RxHamburgerMenu />
        </button>
      </div>
      <div
        className={`fixed inset-0 bg-white flex flex-col justify-center items-center z-50 transform transition-transform duration-300 md:hidden ${
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

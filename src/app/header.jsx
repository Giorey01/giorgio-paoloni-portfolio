"use client";
import { FaInstagram } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import React, { useState } from "react";
import Link from "next/link";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="text-2xl font-serif tracking-tighter">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Giorgio Paoloni
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-light">
          <Link href="/" className="hover:text-gray-500 transition-colors">Home</Link>
          <Link href="/portfolio" className="hover:text-gray-500 transition-colors">Portfolio</Link>
          <Link href="/about" className="hover:text-gray-500 transition-colors">About</Link>
          <Link href="/blog" className="hover:text-gray-500 transition-colors">Blog</Link>
        </div>

        {/* Social Icon & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            href="https://www.instagram.com/_jojifilm_/"
            rel="noopener noreferrer"
            target="_blank"
            className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            <FaInstagram className="w-5 h-5 text-gallery-dark" />
          </Link>
          <button
            aria-expanded={isNavOpen}
            className="md:hidden p-2 text-gallery-dark cursor-pointer hover:opacity-70 transition-all"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <RxHamburgerMenu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-gallery-white flex flex-col justify-center items-center z-50 transform transition-transform duration-300 md:hidden ${
          isNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute top-0 w-full h-20 flex items-center justify-between px-6 border-b border-gray-100"
        >
          <div className="text-2xl font-serif tracking-tighter">
            <Link href="/" onClick={() => setIsNavOpen(false)} className="hover:opacity-70 transition-opacity">
              Giorgio Paoloni
            </Link>
          </div>
          <button
            className="p-2 text-gallery-dark cursor-pointer hover:opacity-70 transition-all"
            onClick={() => setIsNavOpen(false)}
          >
            <RxCross2 className="w-6 h-6" />
          </button>
        </div>
        <ul className="flex flex-col items-center justify-center space-y-8 text-xl uppercase tracking-widest font-light">
          <li>
            <Link href="/" onClick={() => setIsNavOpen(false)} className="hover:text-gray-500 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/portfolio" onClick={() => setIsNavOpen(false)} className="hover:text-gray-500 transition-colors">
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setIsNavOpen(false)} className="hover:text-gray-500 transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/blog" onClick={() => setIsNavOpen(false)} className="hover:text-gray-500 transition-colors">
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

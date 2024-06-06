import React from "react";
import { FaInstagram } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

function Header() {
  return (
    <div className="flex items-center justify-between px-7 mt-4 h-10 w-full">
      <a href="https://www.instagram.com/_jojifilm_/" rel="noopener noreferrer">
        <FaInstagram className="scale-150" />
      </a>
      <RxHamburgerMenu className="scale-150" />
    </div>
  );
}

export default Header;

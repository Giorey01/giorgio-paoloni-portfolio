import React from "react";

function Footer() {
  return (
    <footer className="flex justify-center items-center w-full gap-12 absolute bottom-0 h-12 text-xs font-medium">
      <p>©2024 Giorgio Paoloni™</p>
      <ul className="flex gap-3">
        <li>Privacy Policy</li>
        <li>Licensing</li>
        <li>Contact</li>
      </ul>
    </footer>
  );
}

export default Footer;

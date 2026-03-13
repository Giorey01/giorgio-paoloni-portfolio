import React from "react";

function Footer() {
  return (
    <footer className="bg-white py-12 md:py-16 px-4 md:px-6 relative mt-12 md:mt-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-2xl font-serif italic mb-8 md:mb-10 text-gallery-dark">Giorgio Paoloni</div>
        <div className="flex space-x-6 md:space-x-8 mb-10 md:mb-12">
          <a className="text-gray-400 hover:text-gallery-dark transition-colors uppercase text-sm tracking-widest" href="#">Instagram</a>
          <a className="text-gray-400 hover:text-gallery-dark transition-colors uppercase text-sm tracking-widest" href="#">Behance</a>
          <a className="text-gray-400 hover:text-gallery-dark transition-colors uppercase text-sm tracking-widest" href="#">Vimeo</a>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-gray-400 text-center">
          © {new Date().getFullYear()} GIORGIO PAOLONI PHOTOGRAPHY. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

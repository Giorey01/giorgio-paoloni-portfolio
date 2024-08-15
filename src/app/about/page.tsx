import React from "react";
import Image from "next/image";
import { FaArrowDownLong } from "react-icons/fa6";

function About() {
  return (
    <div className="flex flex-col items-center gap-8 min-h-full">
      <Image
        src={
          "https://d321io5nxf2wuu.cloudfront.net/Assets/Foto_Profilo-removebg-preview.webp"
        }
        width={500}
        height={500}
        alt="ciao"
      />
      <h1 className="text-center text-6xl font-extrabold">HELLO!</h1>
      <p className="text-center px-10 tracking-wide">
        Hi, my name is Giorgio Paoloni. <br />
        In my free time I like to document the places I visit through
        photography. Every shot is a way to share the experiences and beauties I
        encounter along my path.
      </p>
      <h1 className="text-4xl font-semibold mt-8">Contact me</h1>
      <form
        action=""
        className="flex flex-col gap-5 justify-start w-full px-10"
      >
        <h4 className="text-xl">Your email</h4>
        <input
          type="email"
          name=""
          id="1"
          placeholder="email"
          className="border-2 rounded-md p-1 focus:outline-none focus:border-[#2F3645] transition-colors duration-300"
        />
        <h4 className="text-xl">Message</h4>
        <input
          type="text"
          name="message"
          id="2"
          placeholder="message"
          className="border-2 rounded-md p-1 h-28 focus:outline-none focus:border-[#2F3645] transition-colors duration-300"
        />
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#2F3645] w-28 text-[#EEEDEB] rounded-md font-semibold p-3"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default About;

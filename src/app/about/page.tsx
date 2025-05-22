"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaArrowDownLong } from "react-icons/fa6";

function About() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedbackMessage("");

    // Basic client-side validation
    if (!email.trim() || !message.trim()) {
      setFeedbackMessage("Email and message fields cannot be empty.");
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setFeedbackMessage("Invalid email format.");
        setStatus("error");
        return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      const result = await response.json();

      if (response.ok) {
        setFeedbackMessage(result.message || "Message sent successfully!");
        setStatus("success");
        setEmail("");
        setMessage("");
      } else {
        setFeedbackMessage(result.error || "An error occurred.");
        setStatus("error");
      }
    } catch (error) {
      setFeedbackMessage("Failed to send message. Please try again later.");
      setStatus("error");
    }
  };

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
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-start w-full px-10"
      >
        <h4 className="text-xl">Your email</h4>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          className="border-2 rounded-md p-1 focus:outline-none focus:border-black transition-colors duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
        />
        <h4 className="text-xl">Message</h4>
        <textarea
          name="message"
          id="message"
          placeholder="message"
          className="border-2 rounded-md p-1 h-28 focus:outline-none focus:border-black transition-colors duration-300 resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "loading"}
        />
        <div className="text-center">
          <button
            type="submit"
            className="bg-black w-28 text-white rounded-md font-semibold p-3 disabled:opacity-50"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Send"}
          </button>
        </div>
        {feedbackMessage && (
          <div
            className={`mt-4 text-center p-2 rounded-md ${
              status === "success" ? "bg-green-100 text-green-700" : ""
            } ${status === "error" ? "bg-red-100 text-red-700" : ""}`}
          >
            {feedbackMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default About;

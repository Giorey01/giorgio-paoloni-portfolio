"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaArrowDownLong } from "react-icons/fa6";
import { isValidEmail } from "@/utils/validation";

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
    if (!isValidEmail(email)) {
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
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24 min-h-full max-w-6xl mx-auto px-6 py-8 md:py-12">
      {/* Left side: Photo and Bio */}
      <div className="flex flex-col items-center md:items-start max-w-md w-full">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6 md:mb-8 border border-neutral-300 p-2 bg-white shadow-sm">
          <Image
            src={
              "https://d321io5nxf2wuu.cloudfront.net/Assets/Foto_Profilo-removebg-preview.webp"
            }
            fill
            className="object-cover grayscale"
            alt="Giorgio Paoloni"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-4 md:mb-6 text-neutral-800 text-center md:text-left">
          Giorgio Paoloni
        </h1>
        <div className="space-y-4 text-neutral-600 leading-relaxed text-sm md:text-base text-center md:text-left">
          <p>
            In my free time I like to document the places I visit through photography.
          </p>
          <p>
            Every shot is a way to share the experiences and beauties I encounter along my path, blending digital precision with an analog soul.
          </p>
        </div>
      </div>

      {/* Right side: Contact Form */}
      <div className="flex flex-col w-full max-w-md mt-8 md:mt-0">
        <h2 className="text-2xl font-light tracking-widest uppercase mb-8 md:mb-10 text-neutral-800 border-b border-neutral-300 pb-4 text-center md:text-left">
          Contact
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 md:gap-8 w-full"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-neutral-500">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="your@email.com"
              className="border-b border-neutral-400 bg-transparent py-2 px-0 focus:outline-none focus:border-neutral-800 transition-colors duration-300 rounded-none placeholder-neutral-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-xs uppercase tracking-widest text-neutral-500">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              placeholder="Tell me about your project or say hi..."
              className="border-b border-neutral-400 bg-transparent py-2 px-0 h-28 focus:outline-none focus:border-neutral-800 transition-colors duration-300 resize-none rounded-none placeholder-neutral-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-neutral-800 text-neutral-100 uppercase tracking-widest text-sm py-4 hover:bg-black transition-colors disabled:opacity-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
          </div>
          {feedbackMessage && (
            <div
              className={`mt-4 text-center p-3 text-sm tracking-wide ${
                status === "success" ? "text-neutral-600 border border-neutral-300" : ""
              } ${status === "error" ? "text-red-600 border border-red-200" : ""}`}
            >
              {feedbackMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default About;

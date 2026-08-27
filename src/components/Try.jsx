"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Interact with Razor →",
  "Feel it!",
  "See it in 3D!",
  "Explore every angle!",
];

const CYCLE_MS = 3000;

export default function InteractRazorButton() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setVisible(false);

      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setVisible(true);
      }, 800);

      return () => clearTimeout(timeout);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, [loading]);

  const handleClick = () => {
    if (loading) return;

    setLoading(true);
    setVisible(true);
  };

  return (
    <a
      href="/model"
      onClick={handleClick}
      aria-label={
        loading
          ? "Loading Razor 3D model"
          : "Interact with the Razor 3D model"
      }
      aria-busy={loading}
      className={`group fixed bottom-1/4 right-3 z-50 flex translate-y-1/4 items-center gap-2 sm:right-5 sm:gap-3 md:right-8 ${
        loading ? "cursor-wait" : "cursor-pointer"
      }`}
    >
      {/* Message bubble */}
      <span
        className={`flex items-center rounded-full bg-[#F4F1EA] px-3 py-1.5 text-[10px] font-semibold tracking-wide text-black shadow-lg transition-all duration-500 sm:px-4 sm:py-2 sm:text-xs ${
          visible
            ? "translate-x-0 opacity-100"
            : "translate-x-2 opacity-0"
        }`}
      >
        {loading ? "Reeling you in..." : MESSAGES[index]}
      </span>

      {/* Circular button */}
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:h-14 sm:w-14">
        {/* Pulse */}
        <span
          className={`absolute inset-0 rounded-full bg-[#C6FF00]/40 transition-opacity duration-300 ${
            loading
              ? "animate-ping opacity-0"
              : "animate-ping opacity-100"
          }`}
        />

        {/* Button */}
        <span
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#C6FF00] bg-black shadow-xl transition-all duration-300 sm:h-14 sm:w-14 ${
            loading
              ? "scale-100"
              : "group-hover:scale-105"
          }`}
        >
          {loading ? (
            /* Spinner */
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-[#C6FF00]/30 border-t-[#C6FF00] sm:h-5 sm:w-5"
              aria-hidden="true"
            />
          ) : (
            /* Hand icon */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C6FF00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:h-[22px] sm:w-[22px]"
            >
              <path d="M9 11.5V6a1.5 1.5 0 0 1 3 0v5" />
              <path d="M12 5.5V4a1.5 1.5 0 0 1 3 0v6.5" />
              <path d="M15 6.5V6a1.5 1.5 0 0 1 3 0v7c0 3.5-2 6-5.5 6h-1c-2.5 0-3.9-.8-5.1-2.3l-2.6-3.4a1.4 1.4 0 0 1 2.2-1.7L8 14" />
            </svg>
          )}
        </span>
      </span>
    </a>
  );
}
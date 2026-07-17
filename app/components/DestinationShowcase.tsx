"use client";

import { useState } from "react";

const destinations = [
  {
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    position: "center",
  },
  {
    name: "Hà Nội",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hoan%20Kiem%20Lake%2C%20Hanoi%2C%20Vietnam.jpg",
    position: "center",
  },
  {
    name: "Cancun",
    image:
      "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=900&q=80",
    position: "center",
  },
  {
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    position: "center",
  },
  {
    name: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    position: "center",
  },
  {
    name: "Rome",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
    position: "center",
  },
  {
    name: "Chongqing",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/202308%20Hongya%20Cave%20at%20night%20from%20Qiansimen%20Bridge.jpg",
    position: "center",
  },
];

export default function DestinationShowcase() {
  const [activeDestination, setActiveDestination] = useState("Hà Nội");

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#fff7f7] via-[#fff3fb] to-[#fff7df] px-6 py-24">
      {/* Top text */}
      <div className="mx-auto max-w-[900px] text-center">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl">
          <span className="bg-linear-to-r from-[#2F80ED] to-[#BB00FF] bg-clip-text text-transparent">
            Plan smarter, travel farther
            <br />
            Your whole trip in one place
          </span>
        </h2>
      </div>

      {/* Destination carousel */}
      <div className="mx-auto mt-20 flex max-w-[1250px] items-center justify-center gap-4 overflow-hidden">
        {destinations.map((destination) => {
          const isActive = activeDestination === destination.name;
          const isLongName = destination.name.length > 7;

          return (
            <button
              key={destination.name}
              type="button"
              onClick={() => setActiveDestination(destination.name)}
              className={
                isActive
                  ? "group relative flex h-[350px] min-w-[280px] items-end justify-center overflow-hidden rounded-2xl border-2 border-[#2F80ED] bg-gray-300 shadow-[0_18px_45px_rgba(47,128,237,0.25)] transition-all duration-500"
                  : "group relative flex h-[350px] min-w-[145px] items-end justify-center overflow-hidden rounded-2xl bg-gray-300 opacity-75 transition-all duration-500 hover:opacity-100"
              }
            >
              {/* Picture */}
              <img
                src={destination.image}
                alt={destination.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  objectPosition: destination.position,
                }}
              />

              {/* Dark overlay */}
              <div
                className={
                  isActive
                    ? "absolute inset-0 bg-black/25"
                    : "absolute inset-0 bg-black/45"
                }
              />

              {/* Destination name */}
              <span
                className={
                  isActive
                    ? "relative z-10 mb-8 text-2xl font-black text-white drop-shadow-lg"
                    : isLongName
                      ? "relative z-10 mb-12 rotate-[-90deg] whitespace-nowrap text-lg font-black text-white drop-shadow-lg transition-all duration-500"
                      : "relative z-10 mb-8 rotate-[-90deg] whitespace-nowrap text-xl font-black text-white drop-shadow-lg transition-all duration-500"
                }
              >
                {destination.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Join section */}
      <div className="mx-auto mt-24 text-center">
        <p className="text-[10px] font-black uppercase tracking-wide text-gray-500">
          Sign up now
        </p>

        <h3 className="mt-3 text-3xl font-black">
          <span className="bg-linear-to-r from-[#2F80ED] to-[#BB00FF] bg-clip-text text-transparent">
            Join Trippie
          </span>
        </h3>

        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-5">
          {/* App Store Button */}
          <button className="flex items-center gap-3 rounded-xl bg-linear-to-r from-[#2F80ED] to-[#BB00FF] px-5 py-3 text-white shadow-[0_10px_25px_rgba(47,128,237,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(187,0,255,0.28)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7 shrink-0"
            >
              <path d="M16.365 1.43c0 1.14-.466 2.236-1.198 3.02-.75.8-1.98 1.42-3.04 1.34-.133-1.1.394-2.25 1.14-3.02.77-.81 2.09-1.4 3.098-1.34zM20.998 17.08c-.35.8-.77 1.53-1.26 2.2-.67.92-1.22 1.56-1.65 1.92-.67.59-1.39.89-2.16.91-.55 0-1.22-.16-1.99-.48-.78-.32-1.49-.48-2.15-.48-.69 0-1.43.16-2.22.48-.79.32-1.43.49-1.91.51-.74.03-1.48-.28-2.21-.94-.47-.4-1.05-1.06-1.73-1.99-.73-1-1.33-2.16-1.8-3.47-.5-1.42-.75-2.79-.75-4.1 0-1.5.32-2.8.97-3.9a5.77 5.77 0 0 1 2.06-2.08 5.48 5.48 0 0 1 2.78-.79c.6 0 1.39.19 2.36.56.97.38 1.59.56 1.86.56.2 0 .87-.21 2.01-.63 1.08-.39 1.99-.55 2.74-.49 2.03.16 3.56.97 4.57 2.44-1.82 1.1-2.72 2.65-2.7 4.65.02 1.56.58 2.87 1.7 3.92.5.48 1.06.85 1.68 1.1-.13.38-.27.75-.42 1.1z" />
            </svg>

            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/90">
                Download on the
              </span>
              <span className="text-xl font-extrabold">App Store</span>
            </div>
          </button>

          {/* Google Play Button */}
          <button className="flex items-center gap-3 rounded-xl bg-linear-to-r from-[#2F80ED] to-[#BB00FF] px-5 py-3 text-white shadow-[0_10px_25px_rgba(47,128,237,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(187,0,255,0.28)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-7 w-7 shrink-0"
            >
              <path fill="#00d26a" d="M36 36l260 220-260 220z" />
              <path fill="#00a7ff" d="M36 36l308 176-48 48z" />
              <path fill="#ffb300" d="M36 476l308-176-48-48z" />
              <path
                fill="#ff3d81"
                d="M344 212l88 50c20 12 20 38 0 50l-88 50-48-48z"
              />
            </svg>

            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/90">
                Get it on
              </span>
              <span className="text-xl font-extrabold">Google Play</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import FeatureCarousel from "./components/FeatureCarousel";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center">
      <p className="font-medium text-gray-500">Loading globe...</p>
    </div>
  ),
}) as any;

type Destination = {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
};

const destinations: Destination[] = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    lat: 48.8566,
    lng: 2.3522,
    description:
      "Explore the Eiffel Tower, museums, cafés, art, and beautiful historic neighborhoods.",
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    description:
      "Discover Japanese food, traditional temples, shopping, technology, and nightlife.",
  },
  {
    id: 3,
    name: "Hanoi",
    country: "Vietnam",
    lat: 21.0278,
    lng: 105.8342,
    description:
      "Explore the Old Quarter, lakes, Vietnamese food, cafés, and traditional culture.",
  },
  {
    id: 4,
    name: "New York",
    country: "United States",
    lat: 40.7128,
    lng: -74.006,
    description:
      "Visit Times Square, Central Park, famous museums, restaurants, and the Statue of Liberty.",
  },
];

export default function HomePage() {
  const globeRef = useRef<any>(null);

  const [globeSize, setGlobeSize] = useState(620);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  useEffect(() => {
    function updateGlobeSize() {
      if (window.innerWidth >= 1440) {
        setGlobeSize(660);
        return;
      }

      if (window.innerWidth >= 1024) {
        setGlobeSize(560);
        return;
      }

      setGlobeSize(Math.min(window.innerWidth - 40, 440));
    }

    updateGlobeSize();

    window.addEventListener("resize", updateGlobeSize);

    return () => {
      window.removeEventListener("resize", updateGlobeSize);
    };
  }, []);

  function spinToDestination(destination: Destination) {
    setSelectedDestination(null);

    globeRef.current?.pointOfView(
      {
        lat: destination.lat,
        lng: destination.lng,
        altitude: 1.7,
      },
      1200,
    );

    setTimeout(() => {
      setSelectedDestination(destination);
    }, 1200);
  }

  function createDestinationMarker(item: object) {
    const destination = item as Destination;

    const markerWrapper = document.createElement("div");

    markerWrapper.style.width = "34px";
    markerWrapper.style.height = "34px";
    markerWrapper.style.display = "flex";
    markerWrapper.style.alignItems = "center";
    markerWrapper.style.justifyContent = "center";
    markerWrapper.style.pointerEvents = "auto";
    markerWrapper.style.cursor = "pointer";
    markerWrapper.style.userSelect = "none";

    const pin = document.createElement("button");

    pin.type = "button";
    pin.title = `${destination.name}, ${destination.country}`;
    pin.setAttribute("aria-label", `View ${destination.name}`);

    pin.style.width = "26px";
    pin.style.height = "26px";
    pin.style.padding = "0";
    pin.style.border = "3px solid white";
    pin.style.borderRadius = "50% 50% 50% 0";
    pin.style.background = "linear-gradient(135deg, #2F80ED, #BB00FF)";
    pin.style.boxShadow = "0 0 16px rgba(187, 0, 255, 0.9)";
    pin.style.transform = "rotate(-45deg)";
    pin.style.transformOrigin = "center";
    pin.style.cursor = "pointer";
    pin.style.pointerEvents = "auto";
    pin.style.transition = "scale 150ms ease";
    pin.style.position = "relative";

    const dot = document.createElement("span");

    dot.style.position = "absolute";
    dot.style.left = "6px";
    dot.style.top = "6px";
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "50%";
    dot.style.backgroundColor = "white";
    dot.style.pointerEvents = "none";

    pin.appendChild(dot);

    // Hover only shows the card.
    markerWrapper.addEventListener("mouseenter", () => {
      pin.style.scale = "1.25";
      setSelectedDestination(destination);
    });

    markerWrapper.addEventListener("mouseleave", () => {
      pin.style.scale = "1";
    });

    // Click spins the globe to that destination.
    markerWrapper.addEventListener("click", (event) => {
      event.stopPropagation();
      spinToDestination(destination);
    });

    markerWrapper.appendChild(pin);

    return markerWrapper;
  }

  function searchDestination(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedSearch = searchText.trim().toLowerCase();

    if (cleanedSearch === "") {
      setSearchError("Please enter a destination");
      return;
    }

    const foundDestination = destinations.find(
      (destination) =>
        destination.name.toLowerCase().includes(cleanedSearch) ||
        destination.country.toLowerCase().includes(cleanedSearch),
    );

    if (foundDestination === undefined) {
      setSearchError("Destination not found");
      return;
    }

    setSearchError("");
    spinToDestination(foundDestination);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4eddf] text-[#07182f]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#fbe9ff] via-[#f4eddf] to-[#f4eddf] px-6 pb-24 pt-8 sm:px-10 lg:px-16 xl:px-24">
        {/* Background rings */}
        <div className="pointer-events-none absolute right-[-260px] top-[-130px] h-[820px] w-[820px] rounded-full border-[95px] border-white/30" />
        <div className="pointer-events-none absolute right-[-120px] top-[40px] h-[620px] w-[620px] rounded-full border-[75px] border-purple-100/30" />

        {/* NAVIGATION */}
        <nav className="relative z-50 flex w-full items-center justify-between">
          <div className="flex items-center gap-8 text-base font-extrabold sm:gap-10 sm:text-lg">
            <Link href="/" className="transition hover:text-[#7c3aed]">
              Home
            </Link>

            <a href="#hotels" className="transition hover:text-[#7c3aed]">
              Hotels
            </a>

            <a href="#deals" className="transition hover:text-[#7c3aed]">
              Deals
            </a>

            <a href="#features" className="transition hover:text-[#7c3aed]">
              Guides
            </a>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/login"
              className="text-base font-extrabold text-[#07182f] transition hover:text-[#7c3aed] sm:text-lg"
            >
              Sign In
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              className="text-2xl font-black text-[#4f46e5] transition hover:scale-110"
            >
              ≡
            </button>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-30 mx-auto grid w-full max-w-[1500px] items-center gap-8 pt-24 lg:grid-cols-[620px_1fr] lg:pt-20">
          {/* LEFT SIDE */}
          <div className="relative z-40">
            <h1 className="text-[54px] font-black uppercase leading-[0.92] tracking-tight sm:text-[72px] lg:text-[78px]">
              <span className="bg-linear-to-r from-[#2F80ED] to-[#BB00FF] bg-clip-text text-transparent">
                Ready to see
                <br />
                the world?
              </span>
            </h1>

            <p className="mt-5 text-2xl font-extrabold">
              Experience the world in your way
            </p>

            {/* SEARCH BAR */}
            <form
              onSubmit={searchDestination}
              className="relative z-50 mt-7 w-full max-w-[680px]"
            >
              <div className="flex h-[72px] w-full items-center rounded-full bg-white/95 px-7 shadow-[0_14px_35px_rgba(15,23,42,0.18)]">
                <span className="mr-5 text-4xl font-light text-gray-400">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search Destinations"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-xl text-gray-900 outline-none placeholder:text-gray-400"
                />

                <button
                  type="submit"
                  className="hidden rounded-full bg-linear-to-r from-[#2F80ED] to-[#BB00FF] px-8 py-4 text-lg font-bold text-white transition hover:opacity-90 sm:block"
                >
                  Search
                </button>
              </div>
            </form>

            <p className="mt-2 h-5 text-sm text-red-500">{searchError}</p>

            <Link
              href="/signup"
              className="mt-14 inline-flex rounded-full bg-linear-to-r from-[#2F80ED] to-[#BB00FF] px-8 py-5 text-xl font-extrabold text-white shadow-[0_14px_28px_rgba(124,58,237,0.35)] transition hover:-translate-y-1 hover:shadow-xl"
            >
              Get started.
            </Link>
          </div>

          {/* RIGHT SIDE: GLOBE */}
          <div className="relative z-20 flex justify-center overflow-visible lg:-ml-10">
            <div
              className="relative overflow-visible"
              style={{
                width: globeSize,
                height: globeSize,
              }}
            >
              <div className="pointer-events-none absolute inset-8 rounded-full bg-purple-300/20 blur-3xl" />

              <Globe
                ref={globeRef}
                width={globeSize}
                height={globeSize}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                showAtmosphere={true}
                atmosphereColor="#9b5cff"
                atmosphereAltitude={0.12}
                htmlElementsData={destinations}
                htmlLat={(item: object) => (item as Destination).lat}
                htmlLng={(item: object) => (item as Destination).lng}
                htmlAltitude={0.02}
                htmlElement={createDestinationMarker}
                htmlElementVisibilityModifier={(
                  element: HTMLElement,
                  isVisible: boolean,
                ) => {
                  element.style.opacity = isVisible ? "1" : "0";
                  element.style.pointerEvents = isVisible ? "auto" : "none";
                }}
                htmlTransitionDuration={0}
                onGlobeClick={() => setSelectedDestination(null)}
              />
            </div>
          </div>
        </div>

        {/* DESTINATION CARD */}
        {selectedDestination !== null && (
          <div className="absolute right-[8%] top-[330px] z-50 w-[340px] rounded-[32px] bg-white/85 p-6 text-gray-900 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => setSelectedDestination(null)}
              className="absolute right-5 top-4 text-2xl text-gray-400 hover:text-black"
            >
              ×
            </button>

            <p className="mb-1 pr-8 text-sm font-semibold text-purple-600">
              Popular destination
            </p>

            <h2 className="pr-8 text-3xl font-bold">
              {selectedDestination.name}
            </h2>

            <p className="mb-4 text-sm text-gray-500">
              {selectedDestination.country}
            </p>

            <p className="mb-5 text-sm leading-6 text-gray-700">
              {selectedDestination.description}
            </p>

            <button className="w-full rounded-2xl bg-linear-to-r from-[#2F80ED] to-[#BB00FF] py-4 font-semibold text-white">
              Explore {selectedDestination.name}
            </button>
          </div>
        )}
      </section>

      {/* FEATURE CAROUSEL */}
      <FeatureCarousel />
    </main>
  );
}
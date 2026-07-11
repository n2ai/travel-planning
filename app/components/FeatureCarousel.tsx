"use client";

import { useState } from "react";

const featureTabs = [
  {
    icon: "✦",
    title: "Assistant",
    heading: "AI Travel Assistant",
    description: "Get help planning your trip faster with smart suggestions.",
  },
  {
    icon: "👥",
    title: "Collaboration",
    heading: "Plan With Friends",
    description: "Invite friends and build the trip together in one place.",
  },
  {
    icon: "💵",
    title: "Budget",
    heading: "Budget Tracker",
    description: "Track your travel budget, hotels, food, and activities.",
  },
  {
    icon: "☷",
    title: "Checklist",
    heading: "Your Checklist",
    description: "Keep all important travel tasks organized before your trip.",
  },
  {
    icon: "▦",
    title: "Planner",
    heading: "Trip Planner",
    description: "Plan each day with destinations, activities, and notes.",
  },
  {
    icon: "🛏",
    title: "Hotels",
    heading: "Hotel Finder",
    description: "Save hotels and compare places to stay during your trip.",
  },
];

export default function FeatureCarousel() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(3);

  const activeFeature = featureTabs[activeFeatureIndex];

  function getCarouselItems() {
    const positions = [-2, -1, 0, 1, 2];

    return positions.map((position) => {
      const index =
        (activeFeatureIndex + position + featureTabs.length) %
        featureTabs.length;

      return {
        feature: featureTabs[index],
        index: index,
        position: position,
      };
    });
  }

  const carouselItems = getCarouselItems();

  function goToPreviousFeature() {
    setActiveFeatureIndex(
      (activeFeatureIndex - 1 + featureTabs.length) % featureTabs.length,
    );
  }

  function goToNextFeature() {
    setActiveFeatureIndex((activeFeatureIndex + 1) % featureTabs.length);
  }

  return (
    <section id="features" className="relative bg-[#f4eddf] px-8 pb-16 pt-10">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <h2 className="-mt-8 mb-14 text-center text-4xl font-black">
        <span className="bg-linear-to-r from-[#2F80ED] to-[#BB00FF] bg-clip-text text-transparent">
          Features that you will need
        </span>
      </h2>

      {/* Carousel row */}
      <div className="relative mx-auto max-w-[1050px] overflow-visible">

        <div className="mx-auto flex max-w-[820px] items-start justify-center gap-10 overflow-visible px-4 pb-6 pt-8">
          {carouselItems.map((item) => {
            const isActive = item.position === 0;

            return (
              <button
                key={item.feature.title}
                type="button"
                onClick={() => setActiveFeatureIndex(item.index)}
                className={
                  isActive
                    ? "z-20 flex min-w-[100px] scale-110 flex-col items-center text-center opacity-100 transition-all duration-500 ease-out"
                    : Math.abs(item.position) === 1
                      ? "z-10 flex min-w-[100px] scale-95 flex-col items-center text-center opacity-70 transition-all duration-500 ease-out hover:scale-100 hover:opacity-100"
                      : "flex min-w-[100px] scale-90 flex-col items-center text-center opacity-35 transition-all duration-500 ease-out hover:opacity-70"
                }
              >
                <div
                  className={
                    isActive
                      ? "mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-[#2F80ED] to-[#BB00FF] text-3xl font-bold text-white shadow-[0_14px_35px_rgba(139,61,255,0.45)] transition-all duration-500 ease-out"
                      : "mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e2d8c7] bg-white/30 text-2xl text-[#b8b0a5] shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out hover:bg-white/70 hover:text-purple-500 hover:shadow-[0_12px_30px_rgba(139,61,255,0.18)]"
                  }
                >
                  {item.feature.icon}
                </div>

                <p
                  className={
                    isActive
                      ? "text-xs font-extrabold text-black transition-all duration-500"
                      : "text-xs font-bold text-[#b8b0a5] transition-all duration-500 hover:text-gray-700"
                  }
                >
                  {item.feature.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content under selected feature */}
      <div
        key={activeFeature.title}
        className="mx-auto mt-20 flex min-h-[430px] max-w-[980px] animate-[fadeIn_350ms_ease-out] items-center justify-center rounded-[28px] bg-linear-to-br from-white/40 via-[#f6f0ea] to-[#ffe7f3] p-10 shadow-sm"
      >
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto h-[340px] w-[560px] max-w-full">
            <div className="absolute left-8 top-8 h-[300px] w-[280px] rounded-3xl bg-white shadow-[0_15px_40px_rgba(15,23,42,0.18)] transition-all duration-500">
              <div className="mx-auto mt-24 h-[2px] w-[120px] bg-gray-300" />
              <div className="mx-auto mt-4 h-[2px] w-[150px] bg-gray-300" />
              <div className="mx-auto mt-4 h-[2px] w-[120px] bg-gray-300" />
              <div className="mx-auto mt-4 h-[2px] w-[160px] bg-gray-300" />
              <div className="mx-auto mt-4 h-[2px] w-[130px] bg-gray-300" />
              <div className="mx-auto mt-4 h-[2px] w-[110px] bg-gray-300" />
            </div>

            <div className="absolute right-6 top-24 h-[290px] w-[300px] rounded-3xl bg-white p-10 shadow-[0_15px_40px_rgba(15,23,42,0.22)] transition-all duration-500">
              <h3 className="mb-10 text-center text-sm font-black">
                {activeFeature.heading}
              </h3>

              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="mb-5 flex items-center justify-between"
                >
                  <div className="w-full">
                    <div className="mb-2 h-[2px] w-[110px] bg-gray-300" />
                    <div className="h-[2px] w-[160px] bg-gray-300" />
                  </div>

                  <div className="ml-4 flex h-4 w-4 items-center justify-center rounded-sm bg-[#8b3dff] text-[10px] text-white">
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[360px] text-center lg:text-left">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-[#2F80ED] to-[#BB00FF] text-3xl text-white shadow-lg transition-all duration-300 lg:mx-0">
              {activeFeature.icon}
            </div>

            <h3 className="mb-4 text-3xl font-black text-[#07182f]">
              {activeFeature.heading}
            </h3>

            <p className="text-base font-medium leading-7 text-gray-600">
              {activeFeature.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
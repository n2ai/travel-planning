"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import type { Destination } from "@/lib/type";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center">
      <p className="font-medium text-gray-500">Loading globe...</p>
    </div>
  ),
}) as any;



type GlobeSectionProps = {
  globeRef: RefObject<any>;
  globeSize: number;
  destinations: Destination[];
  onSelectDestination: (destination: Destination | null) => void;
  onSpinToDestination: (destination: Destination) => void;
};

export default function GlobeSection({
  globeRef,
  globeSize,
  destinations,
  onSelectDestination,
  onSpinToDestination,
}: GlobeSectionProps) {
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

    markerWrapper.addEventListener("mouseenter", () => {
      pin.style.scale = "1.25";
      onSelectDestination(destination);
    });

    markerWrapper.addEventListener("mouseleave", () => {
      pin.style.scale = "1";
    });

    markerWrapper.addEventListener("click", (event) => {
      event.stopPropagation();
      onSpinToDestination(destination);
    });

    markerWrapper.appendChild(pin);
    return markerWrapper;
  }

  return (
    <div className="relative z-20 flex justify-center overflow-visible lg:-ml-10">
      <div
        className="relative overflow-visible"
        style={{ width: globeSize, height: globeSize }}
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
          onGlobeClick={() => onSelectDestination(null)}
        />
      </div>
    </div>
  );
}
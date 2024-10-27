"use client";

import Script from "next/script";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=alpha&libraries=maps3d`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Google Maps script loaded successfully");
        }}
        onError={(e) => {
          console.error("Error loading Google Maps script", e);
        }}
      />

      <gmp-map-3d
        center="37.841157, -122.551679"
        tilt="67.5"
        className="w-full h-full"
      ></gmp-map-3d>
    </>
  );
}

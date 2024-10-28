"use client";

import Script from "next/script";
import Card from "../components/Card";
import { roadPlotCoords } from "@/constants";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const cameraFollowPath = async (
    coordinates: { lat: number; lng: number }[]
  ) => {
    const map = document.querySelector("gmp-map-3d");
    if (map) {
      for (let i = 0; i < coordinates.length; i += 8) {
        let coord = coordinates[i];
        (map as any).flyCameraTo({
          endCamera: {
            center: { lat: coord.lat, lng: coord.lng, altitude: 0 },
            tilt: 45,
            range: 300,
          },
          durationMillis: 3434,
        });
        await delay(3500);
      }
    }
  };

  const plotRoute = async () => {
    const polyline = document.querySelector("gmp-polyline-3d");
    if (polyline) {
      let coordinates = [
        { lat: 7.088590058201684, lng: 125.6157675218048 },
        { lat: 7.086619621051946, lng: 125.61335788028943 },
        { lat: 7.087388375757098, lng: 125.61301131594766 },
        { lat: 7.08783344368445, lng: 125.61357805057715 },
        { lat: 7.088508306276241, lng: 125.61303443179159 },
      ];
      coordinates = roadPlotCoords;
      customElements.whenDefined(polyline.localName).then(() => {
        (polyline as any).coordinates = coordinates;
      });
    } else {
      console.error("Polyline element not found");
    }
  };

  const handleButtonClickTwo = async () => {
    await cameraFollowPath(roadPlotCoords);
  };

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
        heading="25"
        range="2500"
        tilt="45"
        center="7.087238671006556,125.61437310997654,165"
      >
        <gmp-polyline-3d
          altitude-mode="clamp-to-ground"
          stroke-color="rgba(25, 102, 210, 0.75)"
          stroke-width="10"
        ></gmp-polyline-3d>
      </gmp-map-3d>
      <Card
        title="Obrero"
        description="Obrero is a route in lorem ipsum."
        buttonClickOne={plotRoute}
        buttonClickTwo={handleButtonClickTwo}
      />
    </>
  );
}

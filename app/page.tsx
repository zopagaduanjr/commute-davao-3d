"use client";

import { useRef } from "react";
import Script from "next/script";
import { routeOneCoords, routeTwoCoords } from "@/constants";
import { LatLng, Route } from "@/types";
import RoutesCard from "@/components/RoutesCard";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<HTMLElement | null>(null);

  const routes: Route[] = [
    { id: "route1", label: "Route 1", checked: false },
    { id: "route2", label: "Route 2", checked: false },
  ];

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

  const plotRoute = async (id: string, routeCoord: LatLng[]) => {
    const map = mapRef.current;
    const poly = document.createElement("gmp-polyline-3d");
    poly.setAttribute("altitude-mode", "clamp-to-ground");
    poly.setAttribute("stroke-color", "rgba(25, 102, 210, 0.75)");
    poly.setAttribute("stroke-width", "10");
    poly.setAttribute("id", id);
    map!.appendChild(poly);

    customElements.whenDefined(poly.localName).then(() => {
      (poly as any).coordinates = routeCoord;
    });
  };

  const handleButtonClickTwo = async () => {
    await cameraFollowPath(roadPlotCoords);
  };

  const handleCheckboxChange = (route: Route) => {
    if (!route.checked) {
      if (route.id === "route1") {
        plotRoute(route.id, routeOneCoords);
      } else if (route.id === "route2") {
        plotRoute(route.id, routeTwoCoords);
      }
    } else {
      const map = mapRef.current;
      const poly = map!.querySelector(`#${route.id}`);
      if (poly) {
        poly.remove();
      }
    }
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
        ref={mapRef}
      ></gmp-map-3d>
      <RoutesCard
        routes={routes}
        onCheckboxChange={handleCheckboxChange}
      ></RoutesCard>
    </>
  );
}

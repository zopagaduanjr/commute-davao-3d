"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { routeOneCoords, routeTwoCoords } from "@/constants";
import { LatLng, Route } from "@/types";
import RoutesCard from "@/components/RoutesCard";
import RouteInfoCard from "@/components/RouteInfoCard";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<HTMLElement | null>(null);

  const [routes, setRoutes] = useState<Route[]>([
    { id: "route1", label: "Route 1", checked: false },
    { id: "route2", label: "Route 2", checked: false },
  ]);

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

  const handleCheckboxChange = (updatedRoute: Route) => {
    const updatedRoutes = routes.map((route) =>
      route.id === updatedRoute.id
        ? { ...route, checked: !route.checked }
        : route
    );
    setRoutes(updatedRoutes);
    if (!updatedRoute.checked) {
      if (updatedRoute.id === "route1") {
        plotRoute(updatedRoute.id, routeOneCoords);
      } else if (updatedRoute.id === "route2") {
        plotRoute(updatedRoute.id, routeTwoCoords);
      }
    } else {
      const map = mapRef.current;
      const poly = map!.querySelector(`#${updatedRoute.id}`);
      if (poly) {
        poly.remove();
      }
    }
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const cameraFollowPath = async (
    coordinates: { lat: number; lng: number }[]
  ) => {
    const map = mapRef.current;
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
  };

  const handleRouteInfoCardButton = async (route: Route) => {
    if (route.id === "route1") {
      await cameraFollowPath(routeOneCoords);
    } else if (route.id === "route2") {
      await cameraFollowPath(routeOneCoords);
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
      {routes.some((route) => route.checked) && (
        <RouteInfoCard
          routes={routes}
          onButtonClick={handleRouteInfoCardButton}
        />
      )}
    </>
  );
}

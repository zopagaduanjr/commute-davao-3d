"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { routeOneCoords, routeTwoCoords } from "@/constants";
import { Route } from "@/types";
import RoutesCard from "@/components/RoutesCard";
import RouteInfoCard from "@/components/RouteInfoCard";
import { tailwindColors, divideRouteIntoSegments, delay } from "@/utils";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<boolean>(false);
  const isCameraFollowEnabledRef = useRef<boolean>(false);

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "route1",
      label: "Route 1",
      latlngs: routeOneCoords,
      color: tailwindColors.blue,
      isChecked: false,
      isFollowed: false,
    },
    {
      id: "route2",
      label: "Route 2",
      latlngs: routeTwoCoords,
      color: tailwindColors.green,
      isChecked: false,
      isFollowed: false,
    },
  ]);

  const plotRoute = async (route: Route) => {
    const map = mapRef.current;
    const poly = document.createElement("gmp-polyline-3d");
    poly.setAttribute("altitude-mode", "clamp-to-ground");
    poly.setAttribute("stroke-color", route.color);
    poly.setAttribute("stroke-width", "10");
    poly.setAttribute("id", route.id);
    map!.appendChild(poly);

    customElements.whenDefined(poly.localName).then(() => {
      (poly as any).coordinates = route.latlngs;
    });
  };

  const startCameraFollow = async (
    coordinates: { lat: number; lng: number }[]
  ) => {
    const map = mapRef.current;
    const indexes = divideRouteIntoSegments(coordinates, 75);
    isCameraFollowEnabledRef.current = true;
    for (let i = 0; i < indexes.length; i++) {
      if (cancelRef.current) {
        cancelRef.current = false;
        break;
      }
      let coord = coordinates[indexes[i]];
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

  const stopCameraFollow = () => {
    cancelRef.current = true;
    isCameraFollowEnabledRef.current = false;
    const map = mapRef.current;
    (map as any).stopCameraAnimation();
  };

  const waitForCancel = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!cancelRef.current) {
          clearInterval(interval);
          resolve();
        }
      }, 250);
    });
  };

  const handleTogglePlot = (selectedRoute: Route) => {
    const updatedRoutes = routes.map((route) =>
      route.id === selectedRoute.id
        ? { ...route, isChecked: !route.isChecked }
        : route
    );
    setRoutes(updatedRoutes);
    if (!selectedRoute.isChecked) {
      plotRoute(selectedRoute);
    } else {
      stopCameraFollow();
      const map = mapRef.current;
      const poly = map!.querySelector(`#${selectedRoute.id}`);
      if (poly) {
        poly.remove();
      }
    }
  };

  const handleToggleFollow = async (selectedRoute: Route) => {
    const updatedRoutes = routes.map((route) =>
      route.id === selectedRoute.id
        ? { ...route, isFollowed: !selectedRoute.isFollowed }
        : { ...route, isFollowed: false }
    );
    setRoutes(updatedRoutes);
    if (selectedRoute.isFollowed) {
      stopCameraFollow();
    } else {
      if (isCameraFollowEnabledRef.current) {
        stopCameraFollow();
        await waitForCancel();
      }
      startCameraFollow(selectedRoute.latlngs);
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
        onCheckboxChange={handleTogglePlot}
      ></RoutesCard>
      {routes.some((route) => route.isChecked) && (
        <RouteInfoCard routes={routes} onButtonClick={handleToggleFollow} />
      )}
    </>
  );
}

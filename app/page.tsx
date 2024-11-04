"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { routeOneCoords, routeTwoCoords } from "@/constants";
import { LatLng, Route } from "@/types";
import RoutesCard from "@/components/RoutesCard";
import RouteInfoCard from "@/components/RouteInfoCard";
import { getRandomColor, haversineDistance, delay } from "@/utils";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<boolean>(false);

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "route1",
      label: "Route 1",
      isChecked: false,
      isCameraFollowed: false,
    },
    {
      id: "route2",
      label: "Route 2",
      isChecked: false,
      isCameraFollowed: false,
    },
  ]);

  const plotRoute = async (id: string, routeCoord: LatLng[]) => {
    const map = mapRef.current;
    const poly = document.createElement("gmp-polyline-3d");
    poly.setAttribute("altitude-mode", "clamp-to-ground");
    poly.setAttribute("stroke-color", getRandomColor());
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
        ? { ...route, isChecked: !route.isChecked }
        : route
    );
    setRoutes(updatedRoutes);
    if (!updatedRoute.isChecked) {
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

  const divideRouteIntoSegments = (
    route: { lat: number; lng: number }[],
    n: number
  ): number[] => {
    const indexes: number[] = [0];
    let accumulatedDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
      const distance = haversineDistance(
        route[i].lat,
        route[i].lng,
        route[i + 1].lat,
        route[i + 1].lng
      );

      accumulatedDistance += distance;

      if (accumulatedDistance >= n) {
        indexes.push(i + 1);
        accumulatedDistance = 0;
      }
    }

    return indexes;
  };

  const cameraFollowPath = async (
    coordinates: { lat: number; lng: number }[]
  ) => {
    const map = mapRef.current;
    const indexes = divideRouteIntoSegments(coordinates, 75);
    for (let i = 0; i < indexes.length; i++) {
      if (cancelRef.current) {
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

  const handleRouteInfoCardButton = async (selectedRoute: Route) => {
    if (!selectedRoute.isCameraFollowed) {
      //if there is isCameraFollowed, stop the camera animation and set isCameraFollowed to false
      if (routes.some((route) => route.isCameraFollowed)) {
        const map = mapRef.current;
        cancelRef.current = true;
        (map as any).stopCameraAnimation;
        await delay(1000);
        const updatedRoutes = routes.map((route) =>
          route.isCameraFollowed ? { ...route, isCameraFollowed: false } : route
        );
        setRoutes(updatedRoutes);
      }
      const updatedRoutes = routes.map((route) =>
        route.id === selectedRoute.id
          ? { ...route, isCameraFollowed: !selectedRoute.isCameraFollowed }
          : route
      );
      setRoutes(updatedRoutes);
      cancelRef.current = false;
      selectedRoute.id === "route1"
        ? await cameraFollowPath(routeOneCoords)
        : await cameraFollowPath(routeTwoCoords);
    } else {
      const map = mapRef.current;
      cancelRef.current = true;
      (map as any).stopCameraAnimation();
      const updatedRoutes = routes.map((route) =>
        route.id === selectedRoute.id
          ? { ...route, isCameraFollowed: !selectedRoute.isCameraFollowed }
          : route
      );
      setRoutes(updatedRoutes);
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
      {routes.some((route) => route.isChecked) && (
        <RouteInfoCard
          routes={routes}
          onButtonClick={handleRouteInfoCardButton}
        />
      )}
    </>
  );
}

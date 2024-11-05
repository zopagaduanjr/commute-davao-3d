"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { obreroCoords, routeTwoCoords } from "@/route-coords";
import { obreroInfo } from "@/route-info";
import { Landmark, Route } from "@/types";
import RoutesCard from "@/components/RoutesCard";
import RouteInfoCard from "@/components/RouteInfoCard";
import { tailwindColors, divideRouteIntoSegments, delay } from "@/utils";
import { obreroLandmarks } from "@/route-landmarks";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<boolean>(false);
  const routeFollowingRef = useRef<string | null>(null);

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "obrero",
      label: "Obrero",
      info: obreroInfo,
      landmarks: obreroLandmarks,
      latlngs: obreroCoords,
      color: tailwindColors.blue,
      isChecked: false,
      isFollowed: false,
    },
    {
      id: "route2",
      label: "Route 2",
      info: "",
      landmarks: [],
      latlngs: routeTwoCoords,
      color: tailwindColors.green,
      isChecked: false,
      isFollowed: false,
    },
  ]);

  const [markers, setMarkers] = useState<string[]>([]);

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

  const startCameraFollow = async (route: Route) => {
    const map = mapRef.current;
    const indexes = divideRouteIntoSegments(route.latlngs, 75);
    routeFollowingRef.current = route.id;
    for (let i = 0; i < indexes.length; i++) {
      if (cancelRef.current) {
        cancelRef.current = false;
        break;
      }
      let coord = route.latlngs[indexes[i]];
      (map as any).flyCameraTo({
        endCamera: {
          center: { ...coord, altitude: 0 },
          tilt: i === 0 ? 45 : (map as any).tilt,
          range: i === 0 ? 300 : (map as any).range,
        },
        durationMillis: 3434,
      });
      await delay(3500);
    }
  };

  const stopCameraFollow = async () => {
    cancelRef.current = true;
    routeFollowingRef.current = null;
    const map = mapRef.current;
    (map as any).stopCameraAnimation();
    await waitForCancel();
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
      if (
        selectedRoute.id === routeFollowingRef.current &&
        selectedRoute.isFollowed
      ) {
        stopCameraFollow();
        const updatedRoutes = routes.map((route) =>
          route.id === selectedRoute.id
            ? { ...route, isChecked: !route.isChecked, isFollowed: false }
            : route
        );
        setRoutes(updatedRoutes);
      }
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
      if (routeFollowingRef.current) {
        stopCameraFollow();
      }
      startCameraFollow(selectedRoute);
    }
  };

  const plotMarker = async (landmark: Landmark) => {
    console.log("amdg", markers);
    if (!markers.includes(landmark.id)) {
      const map = mapRef.current;
      const marker = document.createElement("gmp-marker-3d");
      marker.setAttribute("altitude-mode", "clamp-to-ground");
      marker.setAttribute("draws-when-occluded", "true");
      marker.setAttribute("id", landmark.id);
      map!.appendChild(marker);

      customElements.whenDefined(marker.localName).then(() => {
        (marker as any).position = landmark.latlng;
      });
      (map as any).flyCameraTo({
        endCamera: {
          center: { ...landmark.latlng, altitude: 0 },
          tilt: 45,
          range: 300,
        },
        durationMillis: 3434,
      });
      await delay(3500);
      (map as any).flyCameraAround({
        camera: {
          center: { ...landmark.latlng, altitude: 0 },
          tilt: 45,
          range: 300,
        },
        durationMillis: 60000,
        rounds: 1,
      });
      setMarkers([...markers, landmark.id]);
    } else {
      const map = mapRef.current;
      const marker = map!.querySelector(`#${landmark.id}`);
      console.log("amdg marker", marker);
      if (marker) {
        marker.remove();
        setMarkers(markers.filter((m) => m !== landmark.id));
      }
    }
  };

  const handleLandmarkClick = (landmark: Landmark) => {
    if (routeFollowingRef.current) {
      stopCameraFollow();
      const updatedRoutes = routes.map((route) => ({
        ...route,
        isFollowed: false,
      }));
      setRoutes(updatedRoutes);
    }
    plotMarker(landmark);
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
        <RouteInfoCard
          routes={routes}
          onFollowButtonClick={handleToggleFollow}
          onLandmarkButtonClick={handleLandmarkClick}
        />
      )}
    </>
  );
}

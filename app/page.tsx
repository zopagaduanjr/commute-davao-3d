"use client";

import { useRef, useState } from "react";
import Script from "next/script";

import { Landmark, Route } from "@/types";
import RoutesCard from "@/components/RoutesCard";
import RouteInfoCard from "@/components/RouteInfoCard";
import { divideRouteIntoSegments, delay } from "@/utils";
import { jeepRoutes } from "@/constants/routes";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<boolean>(false);
  const routeFollowingRef = useRef<string | null>(null);
  const landmarkFollowingRef = useRef<boolean>(false);

  const [routes, setRoutes] = useState<Route[]>(jeepRoutes);

  const [markers, setMarkers] = useState<string[]>([]);

  const setBounds = () => {
    const map = mapRef.current;
    if (map) {
      (map as any).bounds = {
        south: 6.8,
        west: 125.2,
        north: 7.3,
        east: 125.7,
      };
    }
  };

  const setMapClickListener = () => {
    const map = mapRef.current;
    if (map) {
      (map as any).addEventListener("gmp-click", (clickEvent: any) => {
        (map as any).stopCameraAnimation();
      });
    }
  };

  const plotRoute = (route: Route) => {
    const map = mapRef.current;
    const poly = document.createElement("gmp-polyline-3d");
    poly.setAttribute("altitude-mode", "clamp-to-ground");
    poly.setAttribute("stroke-color", route.color);
    poly.setAttribute("stroke-width", "16");
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
          tilt: i === 0 ? 45 : (map as any).tilt > 45 ? (map as any).tilt : 45,
          range:
            i === 0 ? 300 : (map as any).range > 300 ? (map as any).range : 300,
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
    await waitForCancel();
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
    if (selectedRoute.isFollowed) {
      stopCameraFollow();
      const updatedRoutes = routes.map((route) =>
        route.id === selectedRoute.id
          ? { ...route, isFollowed: !selectedRoute.isFollowed }
          : { ...route, isFollowed: false }
      );
      setRoutes(updatedRoutes);
    } else {
      if (routeFollowingRef.current) {
        await stopCameraFollow();
      }
      const updatedRoutes = routes.map((route) =>
        route.id === selectedRoute.id
          ? { ...route, isFollowed: !selectedRoute.isFollowed }
          : { ...route, isFollowed: false }
      );
      setRoutes(updatedRoutes);
      startCameraFollow(selectedRoute);
    }
  };

  const plotMarker = (landmark: Landmark) => {
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
      setMarkers([...markers, landmark.id]);
    }
    followMarker(landmark);
  };

  const followMarker = async (landmark: Landmark) => {
    landmarkFollowingRef.current = true;
    const map = mapRef.current;
    (map as any).flyCameraTo({
      endCamera: {
        center: { ...landmark.latlng, altitude: 0 },
        tilt: 45,
        range: 300,
      },
      durationMillis: 3434,
    });
    await delay(3500);
    landmarkFollowingRef.current = false;
    (map as any).flyCameraAround({
      camera: {
        center: { ...landmark.latlng, altitude: 0 },
        tilt: 45,
        range: 300,
      },
      durationMillis: 45000,
      rounds: 1,
    });
  };

  const handleLandmarkClick = (landmark: Landmark) => {
    if (!landmarkFollowingRef.current) {
      if (routeFollowingRef.current) {
        stopCameraFollow();
        const updatedRoutes = routes.map((route) => ({
          ...route,
          isFollowed: false,
        }));
        setRoutes(updatedRoutes);
      }
      plotMarker(landmark);
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=alpha&libraries=maps3d`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Google Maps script loaded successfully");
          setBounds();
          setMapClickListener();
        }}
        onError={(e) => {
          console.error("Error loading Google Maps script", e);
        }}
      />
      <div className="flex h-full">
        <div
          className={`transition-all duration-500 ${
            routes.some((route) => route.isChecked) ? "w-4/5" : "w-full"
          }`}
        >
          <gmp-map-3d
            heading="25"
            range="2500"
            tilt="45"
            center="7.087238671006556,125.61437310997654,165"
            ref={mapRef}
          ></gmp-map-3d>
        </div>
        <RoutesCard
          routes={routes}
          onCheckboxChange={handleTogglePlot}
        ></RoutesCard>
        <div
          className={`transition-all duration-500 ${
            routes.some((route) => route.isChecked) ? "w-1/5" : "w-0"
          } bg-gray-800 text-white h-full`}
        >
          {routes.some((route) => route.isChecked) && (
            <div className="h-full max-h-screen overflow-y-auto">
              <RouteInfoCard
                routes={routes}
                onFollowButtonClick={handleToggleFollow}
                onLandmarkButtonClick={handleLandmarkClick}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

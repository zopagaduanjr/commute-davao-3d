"use client";

import Script from "next/script";
import Card from "../components/Card";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const doStuff = async () => {
    const polyline = document.querySelector("gmp-polyline-3d");
    let coordinates = [
      { lat: 7.088590058201684, lng: 125.6157675218048 },
      { lat: 7.086619621051946, lng: 125.61335788028943 },
      { lat: 7.087388375757098, lng: 125.61301131594766 },
      { lat: 7.08783344368445, lng: 125.61357805057715 },
      { lat: 7.088508306276241, lng: 125.61303443179159 },
    ];

    let roadPlotCoords = [
      {
        lat: 7.08865452954261,
        lng: 125.61579036318092,
      },
      {
        lat: 7.0865783931990975,
        lng: 125.61331200205116,
      },
      {
        lat: 7.0833130862086175,
        lng: 125.61606487411498,
      },
      {
        lat: 7.081769275520245,
        lng: 125.61416587013244,
      },
      {
        lat: 7.081535041722866,
        lng: 125.6126638330841,
      },
      {
        lat: 7.076648045824167,
        lng: 125.61329683441161,
      },
      {
        lat: 7.07649401095524,
        lng: 125.61268604207531,
      },
      {
        lat: 7.075503828679511,
        lng: 125.61148441243664,
      },
      {
        lat: 7.075429298744842,
        lng: 125.61124837804333,
      },
      {
        lat: 7.074726587340683,
        lng: 125.61125910687939,
      },
      {
        lat: 7.073778989965629,
        lng: 125.61103380132214,
      },
      {
        lat: 7.073597987998606,
        lng: 125.6110445301582,
      },
      {
        lat: 7.07341698596063,
        lng: 125.6109372417976,
      },
      {
        lat: 7.073289219773461,
        lng: 125.61094797063366,
      },
      {
        lat: 7.0732466310365565,
        lng: 125.61114108968273,
      },
      {
        lat: 7.073321161323568,
        lng: 125.61124837804333,
      },
      {
        lat: 7.073512810577808,
        lng: 125.6112805645515,
      },
      {
        lat: 7.0736086351751,
        lng: 125.61132347989574,
      },
      {
        lat: 7.0736938125782265,
        lng: 125.6126109402229,
      },
    ];
    coordinates = roadPlotCoords;
    if (polyline) {
      customElements.whenDefined(polyline.localName).then(() => {
        (polyline as any).coordinates = coordinates;
      });
    } else {
      console.error("Polyline element not found");
    }

    const map = document.querySelector("gmp-map-3d");
    if (map) {
      for (let i = 0; i < coordinates.length; i++) {
        let coord = coordinates[i];
        (map as any).flyCameraTo({
          endCamera: {
            center: { lat: coord.lat, lng: coord.lng, altitude: 0 },
            tilt: 45,
            range: 500,
          },
          durationMillis: 5000,
        });
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 5000); // 500 milliseconds delay
        });
        console.log("Camera has flown to", coord.lat, coord.lng);
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
      >
        <gmp-polyline-3d
          altitude-mode="relative-to-ground"
          stroke-color="rgba(25, 102, 210, 0.75)"
          stroke-width="10"
        ></gmp-polyline-3d>
      </gmp-map-3d>
      <Card buttonClick={doStuff} />
    </>
  );
}

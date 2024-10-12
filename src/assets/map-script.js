document.addEventListener("DOMContentLoaded", () => {
  const polyline = document.querySelector("gmp-polyline-3d");
  const map = document.querySelector("gmp-map-3d");

  customElements.whenDefined(polyline.localName).then(() => {
    polyline.coordinates = [
      { lat: 37.80515638571346, lng: -122.4032569467164 },
      { lat: 37.80337073509504, lng: -122.4012878349353 },
      { lat: 37.79925208843463, lng: -122.3976697250461 },
      { lat: 37.7989102378512, lng: -122.3983408725656 },
      { lat: 37.79887832784348, lng: -122.3987094864192 },
      { lat: 37.79786443410338, lng: -122.4066878788802 },
      { lat: 37.79549248916587, lng: -122.4032992702785 },
      { lat: 37.78861484290265, lng: -122.4019489189814 },
      { lat: 37.78618687561075, lng: -122.398969592545 },
      { lat: 37.7892310309145, lng: -122.3951458683092 },
      { lat: 37.7916358762409, lng: -122.3981969390652 },
    ];
  });

  customElements.whenDefined(map.localName).then(() => {
    map.flyCameraTo({
      endCamera: {
        center: { lat: 37.6191, lng: -122.3816, altitude: 24 },
        tilt: 67.5,
        range: 1000,
      },
      durationMillis: 5000,
    });
  });
});

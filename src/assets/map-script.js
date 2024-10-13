document.addEventListener("DOMContentLoaded", async () => {
  const polyline = document.querySelector("gmp-polyline-3d");
  const map = document.querySelector("gmp-map-3d");

  let coordinates = [
    { lat: 7.088590058201684, lng: 125.6157675218048 },
    { lat: 7.086619621051946, lng: 125.61335788028943 },
    { lat: 7.087388375757098, lng: 125.61301131594766 },
    { lat: 7.08783344368445, lng: 125.61357805057715 },
    { lat: 7.088508306276241, lng: 125.61303443179159 },
  ];

  customElements.whenDefined(polyline.localName).then(() => {
    polyline.coordinates = coordinates;
  });

  for (let i = 0; i < coordinates.length; i++) {
    let coord = coordinates[i];
    map.flyCameraTo({
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

  // customElements.whenDefined(map.localName).then(() => {
  //   map.flyCameraTo({
  //     endCamera: {
  //       center: { lat: 7.088590058201684, lng: 125.6157675218048, altitude: 0 },
  //       tilt: 45,
  //       range: 2500,
  //     },
  //     durationMillis: 5000,
  //   });
  // });
});

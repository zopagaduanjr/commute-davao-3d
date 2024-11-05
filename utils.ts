export const tailwindColors = {
  red: 'rgba(239, 68, 68, 1)',
  blue: 'rgba(59, 130, 246, 1)',
  green: 'rgba(34, 197, 94, 1)',
  yellow: 'rgba(234, 179, 8, 1)',
};

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const divideRouteIntoSegments = (
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

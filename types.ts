export interface Route {
  id: string;
  label: string;
  info: string;
  landmarks: Landmark[];
  latlngs: LatLng[];
  color: string;
  isChecked: boolean;
  isFollowed: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Landmark {
  id: string;
  label: string;
  latlng: LatLng;
}

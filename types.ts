export interface Route {
  id: string;
  label: string;
  latlngs: LatLng[];
  color: string;
  isChecked: boolean;
  isFollowed: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}

import { Route } from '@/types';
import { obreroInfo, buhanginInfo } from './route-info';
import { obreroLandmarks, sasaLandmarks } from './route-landmarks';
import {
  obreroCoords,
  buhanginCoords,
  sasaCoords,
  route4Coords,
} from './route-coords';
import { tailwindColors } from '@/utils';

export const jeepRoutes: Route[] = [
  {
    id: 'obrero',
    label: 'Obrero',
    info: obreroInfo,
    landmarks: obreroLandmarks,
    latlngs: obreroCoords,
    color: tailwindColors.blue,
    isChecked: false,
    isFollowed: false,
  },
  {
    id: 'buhangin',
    label: 'Buhangin',
    info: buhanginInfo,
    landmarks: [],
    latlngs: buhanginCoords,
    color: tailwindColors.green,
    isChecked: false,
    isFollowed: false,
  },
  {
    id: 'sasa',
    label: 'Sasa',
    info: '',
    landmarks: sasaLandmarks,
    latlngs: sasaCoords,
    color: tailwindColors.red,
    isChecked: false,
    isFollowed: false,
  },
  {
    id: 'route4',
    label: 'Route 4',
    info: '',
    landmarks: [],
    latlngs: route4Coords,
    color: tailwindColors.yellow,
    isChecked: false,
    isFollowed: false,
  },
];

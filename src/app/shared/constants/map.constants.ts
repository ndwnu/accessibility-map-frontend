import { LngLatLike } from 'maplibre-gl';

export const BOUNDS_NL: [LngLatLike, LngLatLike] = [
  [3.21497, 50.70372],
  [7.19205, 53.6104],
];

export const VECTOR_SOURCE = {
  NWB: 'Nationaal wegenbestand',
} as const;

export type VectorSource = keyof typeof VECTOR_SOURCE;

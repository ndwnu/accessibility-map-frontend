import { LngLatLike } from 'maplibre-gl';

export const BOUNDS_NL: [LngLatLike, LngLatLike] = [
  [3.21497, 50.70372],
  [7.19205, 53.6104],
];

export const VECTOR_SOURCE = {
  NWB: 'Nationaal wegenbestand',
} as const;

export type VectorSource = keyof typeof VECTOR_SOURCE;

export type VectorSourceMeta = {
  id: VectorSource;
  sourceName: string;
  sourceLayer: string;
  layerType:
    | 'symbol'
    | 'fill'
    | 'line'
    | 'circle'
    | 'heatmap'
    | 'fill-extrusion'
    | 'raster'
    | 'hillshade'
    | 'background';
};

export const VECTOR_SOURCE_META: VectorSourceMeta[] = [
  {
    id: 'NWB',
    sourceName: 'roadSections',
    sourceLayer: 'roadSections',
    layerType: 'line',
  },
];

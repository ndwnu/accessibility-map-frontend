import { LngLatBounds, LngLatLike } from 'maplibre-gl';

export interface MapState {
  mapZoom?: number;
  mapCenter?: LngLatLike;
  bounds?: LngLatBounds;
}

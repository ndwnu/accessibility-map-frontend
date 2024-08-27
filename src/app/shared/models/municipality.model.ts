import { Feature, FeatureCollection, Point } from 'geojson';
import { LngLatBoundsLike } from 'maplibre-gl';

export type MuncipalityFeatureCollection = FeatureCollection<Point, MuncipalityProperties>;

export interface MuncipalityFeature extends Feature<Point, MuncipalityProperties> {}

export interface MuncipalityProperties {
  name: string;
  searchDistance: number;
  bounds: LngLatBoundsLike;
  requestExemptionUrl: string;
  dateLastCheck?: string;
}

export interface MunicipalityIdAndName {
  id: string;
  name: string;
}

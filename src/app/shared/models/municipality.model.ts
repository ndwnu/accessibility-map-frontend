import { Feature, FeatureCollection, Point } from 'geojson';

export type MuncipalityFeatureCollection = FeatureCollection<Point, MuncipalityProperties>;

export interface MuncipalityFeature extends Feature<Point, MuncipalityProperties> {}

export interface MuncipalityProperties {
  name: string;
  searchDistance: number;
}

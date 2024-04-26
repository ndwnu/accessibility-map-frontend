import { MapLayer } from '@modules/map/elements/models';
import { FeatureCollection } from 'geojson';
import { MapGeoJSONFeature, MapMouseEvent, SourceSpecification } from 'maplibre-gl';
import { Observable } from 'rxjs';

export interface MapSource {
  id: string; // or use a source enum?
  layers: MapLayer[];
  specification: SourceSpecification;
  sourceId: string;
  sourceLayer?: string;
  updateLayersStyles?(): void;
  featureCollection$?: Observable<FeatureCollection>;
  onClick?(event: clickEvent): void;
}

export type clickEvent = MapMouseEvent & {
  features?: MapGeoJSONFeature[];
} & Object;

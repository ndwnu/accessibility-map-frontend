import { MapElementEnum } from '@modules/map/elements/base';
import { MapLayer } from '@ndwnu/map';
import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';

export type clickEvent = MapMouseEvent & {
  features?: MapGeoJSONFeature[];
} & object;

export abstract class BerMapLayer extends MapLayer<MapElementEnum> {}

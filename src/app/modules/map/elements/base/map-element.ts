import { BerMapSource, MapElementEnum } from '@modules/map/elements/base';
import { MapElement, MapElementConfig } from '@ndwnu/map';

export type BerMapElementConfig = MapElementConfig<MapElementEnum>;

export abstract class BerMapElement extends MapElement<MapElementEnum> {
  override sources: BerMapSource[] = [];
}

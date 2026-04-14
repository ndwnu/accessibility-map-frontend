import { BerMapLayer, MapElementEnum } from '@modules/map/elements/base';
import { MapSource } from '@ndwnu/map';

export abstract class BerMapSource extends MapSource<MapElementEnum> {
  override layers: BerMapLayer[] = [];
}

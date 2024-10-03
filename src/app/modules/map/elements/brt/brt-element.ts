import { Map } from 'maplibre-gl';
import { BrtSource } from './brt-source';
import { MapElement } from '@modules/map/elements/base';

export class BrtElement extends MapElement {
  constructor(map: Map) {
    super(map);
    this.sources = [new BrtSource(map)];
  }
}

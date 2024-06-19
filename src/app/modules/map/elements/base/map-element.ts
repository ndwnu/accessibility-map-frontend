import { Map } from 'maplibre-gl';
import { MapSource } from './map-source';

export abstract class MapElement {
  sources: MapSource[] = [];

  constructor(protected readonly map: Map) {
    this.map = map;
  }

  setVisible(visible: boolean) {
    this.sources.forEach((source) => source.setVisible(visible));
  }
}

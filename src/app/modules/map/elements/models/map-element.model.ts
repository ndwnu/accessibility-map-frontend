import { MapSource } from '@modules/map/elements/models';

export interface MapElement {
  id: string; // or use an element enum?
  sources: MapSource[];
  createSources(): void;
  createLayers(): void;
  setupClickHandlers(): void;
}

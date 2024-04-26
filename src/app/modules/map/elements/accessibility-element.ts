import { AccessibilitySource } from '@modules/map/elements/accessibility-source';
import { BaseElement } from '@modules/map/elements/base';
import { MapElement } from '@modules/map/elements/models';
import { Map } from 'maplibre-gl';

export class AccessibilityElement extends BaseElement implements MapElement {
  constructor(id: string, map: Map) {
    super(id, map);
    this.sources = [new AccessibilitySource(id)];
  }
}

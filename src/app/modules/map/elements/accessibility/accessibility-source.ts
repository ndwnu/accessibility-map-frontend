import { environment } from '@env/environment';
import { AccessibilityDataService } from '@shared/services';
import { Map, SourceSpecification } from 'maplibre-gl';
import { MapSource } from '../base/map-source';
import { AccessibilityArrowLayer } from './accessibility-arrow-layer';
import { AccessibilityLayer } from './accessibility-layer';

export class AccessibilitySource extends MapSource {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super('osm-vector', map);

    this.layers = [new AccessibilityLayer(map, accessibilityDataService), new AccessibilityArrowLayer(map)];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'vector',
      tiles: [environment.mapStyles['default']],
    };
  }
}

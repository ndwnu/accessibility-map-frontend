import { environment } from '@env/environment';
import { AccessibilityDataService } from '@shared/services';
import { Map, SourceSpecification } from 'maplibre-gl';
import { MapSource } from '../base/map-source';
import { AccessibilityArrowLayer } from './accessibility-arrow-layer';
import { AccessibilityLayer } from './accessibility-layer';

export class AccessibilitySource extends MapSource {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super('accessibility', map);

    this.layers = [
      new AccessibilityLayer(map, this.id, accessibilityDataService),
      new AccessibilityArrowLayer(map, this.id),
    ];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'vector',
      tiles: [environment.mapStyles['default']],
    };
  }
}

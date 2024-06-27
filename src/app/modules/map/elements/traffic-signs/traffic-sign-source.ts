import { AccessibilityDataService, TrafficSignService } from '@shared/services';
import { Map, SourceSpecification } from 'maplibre-gl';
import { filter, switchMap } from 'rxjs';
import { MapSource } from '../base/map-source';
import { TrafficSignBlackCodeLayer } from './traffic-sign-black-code-layer';
import { TrafficSignBlackCodeSuffixLayer } from './traffic-sign-black-code-suffix-layer';
import { TrafficSignClusterLabelLayer } from './traffic-sign-cluster-label-layer';
import { TrafficSignClusterLayer } from './traffic-sign-cluster-layer';
import { TrafficSignLayer } from './traffic-sign-layer';
import { TrafficSignTextSignLayer } from './traffic-sign-text-sign-layer';

export class TrafficSignSource extends MapSource {
  constructor(map: Map, trafficSignService: TrafficSignService, accessibilityDataService: AccessibilityDataService) {
    super('traffic-signs', map);

    this.featureCollection$ = accessibilityDataService.selectedMunicipalityId$.pipe(
      filter((municipalityId) => !!municipalityId),
      switchMap((municipalityId) => trafficSignService.getTrafficSigns(municipalityId!, this.rvvCodes)),
    );

    this.layers = [
      new TrafficSignLayer(map, this.id, trafficSignService),
      new TrafficSignClusterLayer(map, this.id),
      new TrafficSignClusterLabelLayer(map, this.id),
      new TrafficSignTextSignLayer(map, this.id),
      new TrafficSignBlackCodeSuffixLayer(map, this.id),
      new TrafficSignBlackCodeLayer(map, this.id),
    ];
  }

  get rvvCodes(): string[] {
    return ['C6', 'C7', 'C7a', 'C7b', 'C10', 'C11', 'C12', 'C22c', 'C17', 'C18', 'C19', 'C20', 'C21'];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 1,
    };
  }
}

import { AccessibilityFilter } from '@shared/models';
import { AccessibilityDataService, TrafficSignService } from '@shared/services';
import { ExpressionSpecification, FilterSpecification, Map, SourceSpecification } from 'maplibre-gl';
import { combineLatest, filter, switchMap } from 'rxjs';
import { MapSource } from '../base/map-source';
import { TrafficSignBlackCodeLayer } from './traffic-sign-black-code-layer';
import { TrafficSignBlackCodeSuffixLayer } from './traffic-sign-black-code-suffix-layer';
import { TrafficSignClusterLabelLayer } from './traffic-sign-cluster-label-layer';
import { TrafficSignClusterLayer } from './traffic-sign-cluster-layer';
import { TrafficSignLayer } from './traffic-sign-layer';
import { TrafficSignTextSignLayer } from './traffic-sign-text-sign-layer';

export class TrafficSignSource extends MapSource {
  constructor(
    map: Map,
    private readonly trafficSignService: TrafficSignService,
    private readonly accessibilityDataService: AccessibilityDataService,
  ) {
    super('traffic-signs', map);

    this.layers = [
      new TrafficSignLayer(map, this.id, trafficSignService),
      new TrafficSignClusterLayer(map, this.id),
      new TrafficSignClusterLabelLayer(map, this.id),
      new TrafficSignTextSignLayer(map, this.id),
      new TrafficSignBlackCodeSuffixLayer(map, this.id),
      new TrafficSignBlackCodeLayer(map, this.id),
    ];
  }

  override onInit() {
    super.onInit();

    this.filter$ = this.accessibilityDataService.filter$;

    this.featureCollection$ = combineLatest([
      this.accessibilityDataService.filter$,
      this.accessibilityDataService.selectedMunicipalityId$,
    ]).pipe(
      filter(([, municipalityId]) => !!municipalityId),
      switchMap(([filter, municipalityId]) =>
        this.trafficSignService.getTrafficSigns(municipalityId!, this.getRvvCodes(filter)),
      ),
    );
  }

  getRvvCodes(filter: AccessibilityFilter | undefined) {
    return this.accessibilityDataService.getRvvCodes(filter);
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: true,
      clusterRadius: 20,
    };
  }

  protected override getFilterSpecification(filter: AccessibilityFilter | undefined): FilterSpecification {
    const expression: ExpressionSpecification[] = [];

    // Vehicle length
    expression.push([
      '!',
      [
        'all',
        ['==', ['get', 'rvvCode'], 'C17'],
        ['>', ['to-number', ['get', 'blackCode']], filter?.vehicleLength ?? 0],
      ],
    ]);

    // Vehicle width
    expression.push([
      '!',
      ['all', ['==', ['get', 'rvvCode'], 'C18'], ['>', ['to-number', ['get', 'blackCode']], filter?.vehicleWidth ?? 0]],
    ]);

    // Vehicle height
    expression.push([
      '!',
      [
        'all',
        ['==', ['get', 'rvvCode'], 'C19'],
        ['>', ['to-number', ['get', 'blackCode']], filter?.vehicleHeight ?? 0],
      ],
    ]);

    // Vehicle axle weight
    expression.push([
      '!',
      [
        'all',
        ['==', ['get', 'rvvCode'], 'C20'],
        ['>', ['to-number', ['get', 'blackCode']], filter?.vehicleAxleLoad ?? 0],
      ],
    ]);

    // Vehicle weight
    expression.push([
      '!',
      [
        'all',
        ['==', ['get', 'rvvCode'], 'C21'],
        ['>', ['to-number', ['get', 'blackCode']], filter?.vehicleWeight ?? 0],
      ],
    ]);

    return ['all', ...expression];
  }
}

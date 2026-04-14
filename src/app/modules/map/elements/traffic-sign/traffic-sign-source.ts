import { AccessibilityFilter } from '@shared/models';
import { AccessibilityFilterService, TrafficSignService } from '@shared/services';
import { ExpressionSpecification, FilterSpecification, SourceSpecification } from 'maplibre-gl';
import { combineLatest, filter, switchMap } from 'rxjs';
import { TrafficSignBlackCodeLayer } from './traffic-sign-black-code-layer';
import { TrafficSignBlackCodeSuffixLayer } from './traffic-sign-black-code-suffix-layer';
import { TrafficSignClusterLabelLayer } from './traffic-sign-cluster-label-layer';
import { TrafficSignClusterLayer } from './traffic-sign-cluster-layer';
import { TrafficSignLayer } from './traffic-sign-layer';
import { TrafficSignTextSignLayer } from './traffic-sign-text-sign-layer';
import { TrafficSignBearingLayer } from '@modules/map/elements/traffic-sign/traffic-sign-bearing-layer';
import { BerMapElementConfig, BerMapSource } from '@modules/map/elements/base';

export class TrafficSignSource extends BerMapSource {
  constructor(
    config: BerMapElementConfig,
    private readonly trafficSignService: TrafficSignService,
    private readonly accessibilityFilterService: AccessibilityFilterService,
  ) {
    super('traffic-signs', config);

    this.layers = [
      new TrafficSignLayer(config, this.id, trafficSignService),
      new TrafficSignBearingLayer(config, this.id),
      new TrafficSignClusterLayer(config, this.id),
      new TrafficSignClusterLabelLayer(config, this.id),
      new TrafficSignTextSignLayer(config, this.id),
      new TrafficSignBlackCodeSuffixLayer(config, this.id),
      new TrafficSignBlackCodeLayer(config, this.id),
    ];
  }

  override onInit() {
    super.onInit();

    this.filter$ = this.accessibilityFilterService.filter$;

    this.featureCollection$ = combineLatest([
      this.accessibilityFilterService.filter$,
      this.accessibilityFilterService.selectedMunicipalityId$,
    ]).pipe(
      filter(([, municipalityId]) => !!municipalityId),
      switchMap(([filter, municipalityId]) =>
        this.trafficSignService.getTrafficSigns(municipalityId!, this.getRvvCodes(filter)),
      ),
    );
  }

  getRvvCodes(filter: AccessibilityFilter | undefined) {
    return this.accessibilityFilterService.getRvvCodes(filter);
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

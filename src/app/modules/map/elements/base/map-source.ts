import { AccessibilityFilter } from '@shared/models';
import { FeatureCollection } from 'geojson';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Map, SourceSpecification, GeoJSONSource, FilterSpecification } from 'maplibre-gl';
import { MapLayer } from './map-layer';

export abstract class MapSource {
  layers: MapLayer[] = [];

  protected unsubscribe = new Subject<void>();

  private isInitialized = false;
  private _featureCollection$?: Observable<FeatureCollection>;
  private _filter$?: Observable<AccessibilityFilter | undefined>;

  constructor(
    public readonly id: string,
    protected readonly map: Map,
  ) {}

  onInit() {
    if (!this.map.getSource(this.id)) {
      this.map.addSource(this.id, this.getSpecification() as SourceSpecification);
    }

    this.layers.forEach((layer) => layer.onInit());

    this.isInitialized = true;
  }

  onDestroy() {
    this.isInitialized = false;

    this.layers.forEach((layer) => layer.onDestroy());

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get featureCollection$(): Observable<FeatureCollection> | undefined {
    return this._featureCollection$;
  }

  set featureCollection$(value: Observable<FeatureCollection> | undefined) {
    this._featureCollection$ = value;
    this.subscribeToFeatureCollection();
  }

  get filter$(): Observable<AccessibilityFilter | undefined> | undefined {
    return this._filter$;
  }

  set filter$(value: Observable<AccessibilityFilter | undefined> | undefined) {
    this._filter$ = value;
    this.subscribeToFilters();
  }

  setVisible(visible: boolean) {
    this.layers.forEach((layer) => layer.setVisible(visible));
  }

  protected abstract getSpecification(): Partial<SourceSpecification>;
  protected getFilterSpecification?(filter: AccessibilityFilter | undefined): FilterSpecification;

  private subscribeToFeatureCollection() {
    if (this.featureCollection$) {
      this.featureCollection$.subscribe({
        next: (featureCollection) => {
          const source = this.map.getSource(this.id);
          if (source && source.type === 'geojson') {
            (source as GeoJSONSource).setData(featureCollection);
          } else {
            // not needed because source is always specified as geojson with empty collection
            this.map.addSource(this.id, {
              type: 'geojson',
              data: featureCollection,
            });
          }
        },
        error: (error) => {
          console.error('Error updating feature collection', error);
        },
      });
    }
  }

  // TODO #81306 isn't this causing subscription leaks when setting filter more then once?
  private subscribeToFilters() {
    if (this.isInitialized && this.filter$ && this.getFilterSpecification) {
      this.filter$.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (filter) => {
          this.layers.forEach((layer) => {
            let filterSpecification: FilterSpecification = this.getFilterSpecification!(filter);
            if (layer.getFilterSpecification) {
              // Combine filters when both source and layer have filters specifications defined
              filterSpecification = ['all', filterSpecification, layer.getFilterSpecification()] as FilterSpecification;
            }
            this.map.setFilter(layer.id, filterSpecification);
          });

          this.applyFilterToSourceSpecification(filter);
        },
        error: (error) => {
          console.error('Error updating filter', error);
        },
      });
    }
  }

  /**
   * When clustering is enabled for the source, the filter also need to be applied to the source.
   * Otherwise the clustering will not take into account filtered features and show clusters where no features will be displayed.
   * https://github.com/mapbox/mapbox-gl-js/issues/2613
   * https://github.com/mapbox/mapbox-gl-js/issues/7887
   */
  private applyFilterToSourceSpecification(filter: AccessibilityFilter | undefined) {
    const mapStyle = this.map.getStyle();
    const sourceSpecification = mapStyle.sources[this.id];
    if (sourceSpecification.type === 'geojson' && sourceSpecification.cluster === true) {
      // Clustering is enabled for this GeoJSON source, update filter
      sourceSpecification.filter = this.getFilterSpecification!(filter);
      this.map.setStyle(mapStyle);
    }
  }
}

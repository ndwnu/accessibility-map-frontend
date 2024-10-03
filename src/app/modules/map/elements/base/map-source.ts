import { FeatureCollection } from 'geojson';
import { Map, SourceSpecification, GeoJSONSource } from 'maplibre-gl';
import { Observable, Subject } from 'rxjs';
import { MapLayer } from './map-layer';

export abstract class MapSource {
  layers: MapLayer[] = [];

  protected unsubscribe = new Subject<void>();

  private isInitialized = false;
  private _featureCollection$?: Observable<FeatureCollection>;

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

  setVisible(visible: boolean) {
    this.layers.forEach((layer) => layer.setVisible(visible));
  }

  protected abstract getSpecification(): Partial<SourceSpecification>;

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
}

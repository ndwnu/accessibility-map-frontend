import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map, SourceSpecification } from 'maplibre-gl';
import { Observable } from 'rxjs';
import { MapLayer } from './map-layer';

export abstract class MapSource {
  layers: MapLayer[] = [];

  private _featureCollection$?: Observable<FeatureCollection>;

  constructor(
    public readonly id: string,
    protected readonly map: Map,
  ) {
    this.map.addSource(this.id, this.getSpecification() as SourceSpecification);
  }

  get featureCollection$(): Observable<FeatureCollection> | undefined {
    return this._featureCollection$;
  }

  set featureCollection$(value: Observable<FeatureCollection> | undefined) {
    this._featureCollection$ = value;
    this.subscribeToFeatureCollection();
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

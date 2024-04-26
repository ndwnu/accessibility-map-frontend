import { MapElement, MapSource } from '@modules/map/elements/models';
import { GeoJSONSource, LayerSpecification, Map } from 'maplibre-gl';

export class BaseElement implements MapElement {
  map: Map;
  id: string;
  sources: MapSource[] = [];

  constructor(id: string, map: Map) {
    this.id = id;
    this.map = map;
  }

  createSources() {
    this.sources.forEach((source) => {
      if (!this.map.getSource(source.sourceId)) {
        this.map.addSource(source.sourceId, source.specification);
      }
      this._listenToFeatureCollection(source);
    });
  }

  createLayers() {
    this.sources.forEach((source) => {
      source.layers.forEach((layer) => {
        this.map.addLayer(layer.specification as LayerSpecification);
      });
    });
  }

  setupClickHandlers() {
    // Set to keep track of active interactive layers under the mouse
    const activeLayers = new Set();

    this.sources.forEach((source) => {
      if (!source.onClick) {
        return;
      }

      const onClickHandler = source.onClick;

      // Attach click event to each source layer
      this.map.on('click', source.sourceId, (event) => {
        onClickHandler(event);
      });

      // Use mousemove to determine cursor style
      this.map.on('mousemove', source.sourceId, (event) => {
        activeLayers.add(source.sourceId);
        this.map.getCanvas().style.cursor = 'pointer';
      });

      // Remove the layer from the active set when the mouse leaves the layer
      this.map.on('mouseleave', source.sourceId, (event) => {
        activeLayers.delete(source.sourceId);
        if (activeLayers.size === 0) {
          this.map.getCanvas().style.cursor = '';
        }
      });
    });

    // Handle the case when the mouse leaves the map entirely
    this.map.on('mouseout', () => {
      activeLayers.clear();
      this.map.getCanvas().style.cursor = '';
    });
  }

  _listenToFeatureCollection(mapSource: MapSource) {
    if (mapSource.featureCollection$) {
      mapSource.featureCollection$.subscribe({
        next: (featureCollection) => {
          const source = this.map.getSource(mapSource.sourceId);
          if (source && source.type === 'geojson') {
            (source as GeoJSONSource).setData(featureCollection);
          } else {
            // not needed because source is always specified as geojson with empty collection
            this.map.addSource(mapSource.sourceId, {
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

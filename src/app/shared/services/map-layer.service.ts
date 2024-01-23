import { Injectable } from '@angular/core';
import { VECTOR_SOURCE_META, VectorSource, VectorSourceMeta } from '@shared/constants/map.constants';
import { InaccessibleRoadSection } from '@shared/models';
import { DataDrivenPropertyValueSpecification, LayerSpecification, Map } from 'maplibre-gl';

@Injectable()
export class MapLayerService {
  private readonly lineLayout: LayerSpecification['layout'] = {
    'line-cap': 'butt',
    'line-join': 'bevel',
  };
  private readonly linePaint = {
    'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 15, 8] as DataDrivenPropertyValueSpecification<number>,
  };

  addVectorLayers(map: Map) {
    VECTOR_SOURCE_META.forEach((source) => {
      this.generateVectorLayers(source, true).forEach((layer) => {
        map.addLayer(layer);
      });
    });
  }

  generateVectorLayers(source: VectorSourceMeta, visible: boolean): LayerSpecification[] {
    return [
      {
        id: source.id,
        type: source.layerType,
        source: source.sourceName,
        'source-layer': source.sourceLayer,
        layout: {
          ...this.lineLayout,
          visibility: visible ? 'visible' : 'none',
        },
        paint: {
          ...this.linePaint,
          'line-color': 'green',
          'line-opacity': 0.5,
        },
      },
    ] as LayerSpecification[];
  }

  showInaccesibleRoadSections(map: Map, inaccessibleRoadSections: InaccessibleRoadSection[]) {
    const inaccessibleRoadSectionIds = inaccessibleRoadSections.map((section) => section.roadSectionId);
    const nwbSourceId: VectorSource = 'NWB';
    if (map.getLayer(nwbSourceId)) {
      map.setPaintProperty(nwbSourceId, 'line-color', [
        'case',
        ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]],
        'red',
        'green',
      ]);
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { BerMapElementConfig, MapElementEnum } from '@modules/map/elements/base';
import { NdwLayerFilterFunction } from '@modules/map/elements/ndw/ndw-layer.model';
import { ApiElement } from '@ndwnu/map';
import { LayerSpecification } from 'maplibre-gl';

export class NdwBaseElement extends ApiElement<MapElementEnum> {
  constructor(config: BerMapElementConfig, http: HttpClient) {
    const layerFilter: NdwLayerFilterFunction = (layer) => {
      return (
        layer.metadata.group === 'context-map' ||
        (layer.metadata.group === 'context-roads' &&
          layer.metadata['sub-group'] !== 'NWB-hectometersigns' &&
          layer.metadata.group === 'context-roads' &&
          layer.metadata['sub-group'] !== 'WKD-parking-areas' &&
          layer.metadata.group === 'context-roads' &&
          layer.metadata['sub-group'] !== 'FCD-segments')
      );
    };
    super(config, http, environment.ndw.baseMap, layerFilter as (layer: LayerSpecification) => boolean);

    this.isVisible = true;
  }
}

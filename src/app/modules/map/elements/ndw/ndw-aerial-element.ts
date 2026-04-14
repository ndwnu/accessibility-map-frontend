import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { BerMapElementConfig, MapElementEnum } from '@modules/map/elements/base';
import { NdwLayerFilterFunction } from '@modules/map/elements/ndw/ndw-layer.model';

import { ApiElement } from '@ndwnu/map';
import { LayerSpecification } from 'maplibre-gl';

export class NdwAerialElement extends ApiElement<MapElementEnum> {
  constructor(config: BerMapElementConfig, http: HttpClient) {
    const layerFilter: NdwLayerFilterFunction = (layer) => layer.metadata.group === 'context-luchtfoto';

    super(config, http, environment.ndw.baseMap, layerFilter as (layer: LayerSpecification) => boolean);
  }
}

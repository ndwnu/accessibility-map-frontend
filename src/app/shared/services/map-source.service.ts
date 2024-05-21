import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { VECTOR_SOURCE_META } from '@shared/constants/map.constants';
import { Map } from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class MapSourceService {
  addVectorSources(map: Map) {
    VECTOR_SOURCE_META.forEach((layer) => {
      const layerSourceName = layer.id;
      const tilesUrl = [environment.vectorTiles[layer.id]];
      this.addVectorSourceToMap(map, layerSourceName, tilesUrl);
    });
  }

  private addVectorSourceToMap(map: Map, layerSourceName: string, tiles: string[]) {
    map.addSource(layerSourceName, {
      type: 'vector',
      tiles: tiles,
    });
  }
}

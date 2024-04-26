import { LayerSpecification } from 'maplibre-gl';

export interface MapLayer {
  id: string; // or use a layer enum?
  specification: Partial<LayerSpecification>;
  show: boolean;
}

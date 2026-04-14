import { LayerSpecification } from 'maplibre-gl';

export type NdwLayerSpecification = LayerSpecification & { metadata: { group: string; 'sub-group': string } };
export type NdwLayerFilterFunction = (layer: NdwLayerSpecification) => boolean;

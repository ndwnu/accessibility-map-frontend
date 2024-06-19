import { ColorSpecification, DataDrivenPropertyValueSpecification, LineLayerSpecification } from 'maplibre-gl';

const MIN_ZOOM = 12;
const LINE_OPACITY = 0.75;
const DEFAULT_COLOR = 'rgba(0, 100, 200)';

export interface LineLayerOptions {
  color: string | { colorObject: { [key: string]: string }; propertyString: string };
  sourceLayer?: string;
}

export class LineLayer implements LineLayerSpecification {
  id: string;
  source: string;
  ['source-layer']?: string;
  type: 'line' = 'line';
  minzoom = MIN_ZOOM;

  layout: Pick<LineLayerSpecification, 'layout'>['layout'] = {
    'line-cap': 'butt',
    'line-join': 'bevel',
  };

  paint: Pick<LineLayerSpecification, 'paint'>['paint'] = {
    'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 15, 8] as DataDrivenPropertyValueSpecification<number>,
    'line-opacity': LINE_OPACITY,
  };

  constructor(id: string, sourceId: string, options: LineLayerOptions) {
    this.id = id;
    this.source = sourceId;
    if (options.sourceLayer) {
      this['source-layer'] = options.sourceLayer;
    }

    if (typeof options.color === 'string') {
      this.paint!['line-color'] = options.color;
    } else {
      this.paint!['line-color'] = this.lineColorMapper(options.color.colorObject, options.color.propertyString);
    }
  }

  private lineColorMapper(
    colorObject: { [key: string]: string },
    propertyString: string,
  ): DataDrivenPropertyValueSpecification<ColorSpecification> {
    const colorExpression: any[] = ['case'];
    Object.entries(colorObject).forEach(([key, value]) => {
      colorExpression.push(['==', ['get', propertyString], key], value);
    });
    colorExpression.push(DEFAULT_COLOR);
    return colorExpression as DataDrivenPropertyValueSpecification<ColorSpecification>;
  }
}

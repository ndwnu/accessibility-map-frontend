import { LayerSpecification, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { Map } from 'maplibre-gl';
import StyleLayer from 'maplibre-gl';

export abstract class MapLayer {
  show: boolean = true;

  private static cursorPointerCount = 0;

  constructor(
    protected readonly map: Map,
    protected readonly sourceId: string,
  ) {
    this.map.addLayer(this.getSpecification() as LayerSpecification);

    this.setupClickHandlers();
  }

  get id(): string {
    return `${this.sourceId}-layer`;
  }

  get styleLayer(): StyleLayer | undefined {
    return this.map.getLayer(this.id);
  }

  setVisible(visible: boolean) {
    this.map.setLayoutProperty(this.id, 'visibility', visible ? 'visible' : 'none');
  }

  onClick?(event: clickEvent): void;

  protected abstract getSpecification(): Partial<LayerSpecification>;

  private setupClickHandlers() {
    const onClickHandler = this.onClick;
    if (!onClickHandler) return;

    // Attach click event
    this.map.on('click', this.id, (event) => {
      onClickHandler(event);
    });

    // Use mousemove to determine cursor style
    this.map.on('mouseenter', this.id, () => {
      this.setMouseCursor('pointer');
    });

    // Remove the layer from the active set when the mouse leaves the layer
    this.map.on('mouseleave', this.id, () => {
      this.setMouseCursor('');
    });

    // Handle the case when the mouse leaves the map entirely
    this.map.on('mouseout', () => {
      this.clearMouseCursor();
    });
  }

  private setMouseCursor(cursor: string) {
    if (cursor === 'pointer') {
      MapLayer.cursorPointerCount++;
      this.map.getCanvas().style.cursor = cursor;
    } else if (cursor === '') {
      MapLayer.cursorPointerCount--;
      if (MapLayer.cursorPointerCount < 1) {
        this.clearMouseCursor();
      }
    } else {
      console.warn(`Cursor type '${cursor}' is not supported.`);
    }
  }

  private clearMouseCursor() {
    MapLayer.cursorPointerCount = 0;
    this.map.getCanvas().style.cursor = '';
  }
}

export type clickEvent = MapMouseEvent & {
  features?: MapGeoJSONFeature[];
} & Object;

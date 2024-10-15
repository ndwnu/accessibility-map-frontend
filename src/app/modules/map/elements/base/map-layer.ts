import { FilterSpecification, LayerSpecification, Map, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { Subject } from 'rxjs';

export abstract class MapLayer {
  show: boolean = true;

  protected unsubscribe = new Subject<void>();

  private static cursorPointerCount = 0;

  constructor(
    protected readonly map: Map,
    protected readonly sourceId: string,
  ) {}

  get id(): string {
    return `${this.sourceId}-layer`;
  }

  get styleLayer() {
    return this.map.getLayer(this.id);
  }

  onInit() {
    this.map.addLayer(this.getSpecification() as LayerSpecification);
    this.setupClickHandlers();
  }

  onDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setVisible(visible: boolean) {
    this.map.setLayoutProperty(this.id, 'visibility', visible ? 'visible' : 'none');
  }

  getFilterSpecification?(): FilterSpecification;

  protected onClick?(event: clickEvent): void;
  protected abstract getSpecification(): Partial<LayerSpecification>;

  private setupClickHandlers() {
    if (!this.onClick) return;

    // Attach click event
    this.map.on('click', this.id, (event) => {
      this.onClick?.(event);
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

import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DestinationPopupComponent } from '@modules/map/components/destination-popup';
import { SelectedTrafficSignsComponent } from '@modules/map/components/traffic-signs/selected-traffic-signs';
import { ActivePopupMode, MapPopupService } from '@shared/services';
import { Map } from 'maplibre-gl';

@Component({
  selector: 'ber-map-popup',
  imports: [DestinationPopupComponent, SelectedTrafficSignsComponent],
  templateUrl: './map-popup.component.html',
})
export class MapPopupComponent implements AfterViewInit {
  readonly #overlay = inject(Overlay);
  readonly #mapPopupService = inject(MapPopupService);
  readonly #viewContainerRef = inject(ViewContainerRef);

  // Inputs
  map = input.required<Map>();
  mapElementRef = input.required<ElementRef>();

  // View children
  trafficSignsPopupRef = viewChild.required<TemplateRef<SelectedTrafficSignsComponent>>('trafficSignsPopup');
  destinationPopupRef = viewChild.required<TemplateRef<DestinationPopupComponent>>('destinationPopup');

  // Computed
  activePopupRef = computed<TemplateRef<unknown> | undefined>(() => {
    const popup = this.#mapPopupService.activePopup();
    if (!popup) return undefined;

    const popupRefByType = {
      [ActivePopupMode.Destination]: this.destinationPopupRef,
      [ActivePopupMode.TrafficSign]: this.trafficSignsPopupRef,
    };

    return popupRefByType[popup.type]();
  });

  #lngLat = computed(() => this.#mapPopupService.activePopup()?.lngLat);

  #overlayRef = this.#overlay.create();
  #positionStrategy = this.#overlay.position().global();

  constructor() {
    effect(() => this.#updateOverlay(this.activePopupRef()));
  }

  ngAfterViewInit() {
    this.map().on('move', () => this.#updatePopupPosition());
  }

  closePopup() {
    this.#mapPopupService.closePopup();
  }

  #updateOverlay(activeRef: TemplateRef<unknown> | undefined) {
    this.#overlayRef.detach();
    if (activeRef) {
      this.#updatePopupPosition();
      this.#overlayRef.attach(new TemplatePortal(activeRef, this.#viewContainerRef));
    }
  }

  #updatePopupPosition() {
    const map = this.map();
    const lngLat = this.#lngLat();
    if (!map || !lngLat) return;

    const { x, y } = map.project(lngLat);
    this.#updatePositionStrategy(x, y);
    this.#overlayRef.updatePosition();
  }

  #updatePositionStrategy(clickX: number, clickY: number) {
    const mapEl = this.mapElementRef();

    const { height, width, x, y } = (mapEl.nativeElement as HTMLDivElement).getBoundingClientRect();
    if (clickX > width / 2) {
      this.#positionStrategy.right(`${(width - clickX).toFixed()}px`);
    } else {
      this.#positionStrategy.left(`${(clickX + x).toFixed()}px`);
    }
    if (clickY > height / 2) {
      this.#positionStrategy.bottom(`${(height - clickY).toFixed()}px`);
    } else {
      this.#positionStrategy.top(`${(clickY + y).toFixed()}px`);
    }

    this.#overlayRef.updatePositionStrategy(this.#positionStrategy);
  }
}

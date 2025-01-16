import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MapComponent } from '@modules/map/components/map';
import { ControlPanelComponent } from '@modules/map/components/control-panel';
import { AccessibilityElement } from '@modules/map/elements/accessibility/accessibility-element';
import { DestinationElement } from '@modules/map/elements/destination/destination-element';
import { TrafficSignElement } from '@modules/map/elements/traffic-signs/traffic-sign-element';
import { BrtElement } from '@modules/map/elements/brt/brt-element';
import { AerialElement } from '@modules/map/elements/aerial/aerial-element';
import { AccessibilityDataService, DestinationDataService, TrafficSignService } from '@shared/services';
import { NavigationControl } from 'maplibre-gl';

import { SelectedTrafficSignsComponent } from '../traffic-signs/selected-traffic-signs';

@Component({
  selector: 'ber-main-map',
  standalone: true,
  imports: [ControlPanelComponent, SelectedTrafficSignsComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends MapComponent implements AfterViewInit {
  readonly #accessibilityDataService = inject(AccessibilityDataService);
  readonly #destinationDataService = inject(DestinationDataService);
  readonly #overlay = inject(Overlay);
  readonly #trafficSignService = inject(TrafficSignService);
  readonly #viewContainerRef = inject(ViewContainerRef);

  showControlPanel = input(true);
  openPanel = output();

  popupRef = viewChild.required<TemplateRef<SelectedTrafficSignsComponent>>('trafficSignsPopup');

  lngLat = computed(() => this.#trafficSignService.selectedTrafficSigns()?.[0].lnglat);

  #overlayRef!: OverlayRef;
  #positionStrategy = this.#overlay.position().global();

  get trafficSignElement(): TrafficSignElement | undefined {
    return this.mapElements.find((element) => element instanceof TrafficSignElement);
  }

  constructor() {
    super();
    effect(() => {
      const templatePortal = new TemplatePortal(this.popupRef(), this.#viewContainerRef);
      this.#overlayRef.detach();
      this.#updatePopupPosition();
      this.#overlayRef.attach(templatePortal);
    });
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.#overlayRef = this.#overlay.create();

    this.map?.on('move', () => {
      this.#updatePopupPosition();
    });
  }

  protected override addButtons() {
    this.map.addControl(new NavigationControl(), 'bottom-right');
  }

  protected async onLoadMap() {
    this.mapElements = [
      new BrtElement(this.map),
      new AerialElement(this.map),
      new AccessibilityElement(this.map, this.#accessibilityDataService),
      new TrafficSignElement(this.map, this.#trafficSignService, this.#accessibilityDataService),
      new DestinationElement(this.map, this.#accessibilityDataService, this.#destinationDataService),
    ];

    this.#initializeMapElements();
    this.#loadImages();
  }

  closePopup() {
    this.#overlayRef.detach();
  }

  handleTrafficSignVisible(visible: boolean) {
    this.trafficSignElement?.setVisible(visible);
  }

  setBackgroundLayer(key: string) {
    this.mapElements.find((element) => element instanceof BrtElement)?.setVisible(key === 'brt');
    this.mapElements.find((element) => element instanceof AerialElement)?.setVisible(key === 'aerial');
  }

  #initializeMapElements() {
    this.mapElements.forEach((element) => {
      element.onInit();
    });
    this.mapElements.find((element) => element instanceof TrafficSignElement)?.setVisible(false);
  }

  #loadImages() {
    this.loadImage('arrow-icon', 'assets/images/arrow.png');
    this.loadImage('black-arrow-icon', 'assets/images/black-arrow.png');
    this.loadImage('C6-ZB', 'assets/images/traffic-signs/C6-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C6-ZE', 'assets/images/traffic-signs/C6-END.png', { pixelRatio: 2.5 });
    this.loadImage('C7-ZB', 'assets/images/traffic-signs/C7-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C7-ZH', 'assets/images/traffic-signs/C7-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C7-ZE', 'assets/images/traffic-signs/C7-END.png', { pixelRatio: 2.5 });
    this.loadImage('C7a', 'assets/images/traffic-signs/C7a.png', { pixelRatio: 2 });
    this.loadImage('C7b', 'assets/images/traffic-signs/C7b.png', { pixelRatio: 2 });
    this.loadImage('C17', 'assets/images/traffic-signs/C17.png', { pixelRatio: 2 });
    this.loadImage('C17-ZB', 'assets/images/traffic-signs/C17-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C17-ZE', 'assets/images/traffic-signs/C17-END.png', { pixelRatio: 2.5 });
    this.loadImage('C18', 'assets/images/traffic-signs/C18.png', { pixelRatio: 2 });
    this.loadImage('C18-ZB', 'assets/images/traffic-signs/C18-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C18-ZE', 'assets/images/traffic-signs/C18-END.png', { pixelRatio: 2.5 });
    this.loadImage('C19', 'assets/images/traffic-signs/C19.png', { pixelRatio: 2 });
    this.loadImage('C19-ZB', 'assets/images/traffic-signs/C18-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C19-ZE', 'assets/images/traffic-signs/C18-END.png', { pixelRatio: 2.5 });
    this.loadImage('C20', 'assets/images/traffic-signs/C20.png', { pixelRatio: 2 });
    this.loadImage('C20-ZB', 'assets/images/traffic-signs/C18-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C20-ZE', 'assets/images/traffic-signs/C18-END.png', { pixelRatio: 2.5 });
    this.loadImage('C21', 'assets/images/traffic-signs/C21.png', { pixelRatio: 2 });
    this.loadImage('C21-ZB', 'assets/images/traffic-signs/C18-BEGIN.png', { pixelRatio: 2.5 });
    this.loadImage('C21-ZE', 'assets/images/traffic-signs/C18-END.png', { pixelRatio: 2.5 });
    this.loadImage('C22c', 'assets/images/traffic-signs/C22c.png', { pixelRatio: 2 });
    this.loadImage('text-sign', 'assets/images/text-sign.png', { pixelRatio: 2 });
    this.loadImage('marker-negative', 'assets/images/marker-negative.png');
    this.loadImage('marker-positive', 'assets/images/marker-positive.png');
  }

  #updatePopupPosition() {
    const lngLat = this.lngLat();
    if (!lngLat) {
      return;
    }

    const { x, y } = this.map.project(lngLat);
    this.#updatePositionStrategy(x, y);
    this.#overlayRef.updatePosition();
  }

  #updatePositionStrategy(clickX: number, clickY: number) {
    const { height, width, x, y } = (this.mapElementRef().nativeElement as HTMLDivElement).getBoundingClientRect();
    clickX > width / 2
      ? this.#positionStrategy.right(`${(width - clickX).toFixed()}px`)
      : this.#positionStrategy.left(`${(clickX + x).toFixed()}px`);
    clickY > height / 2
      ? this.#positionStrategy.bottom(`${(height - clickY).toFixed()}px`)
      : this.#positionStrategy.top(`${(clickY + y).toFixed()}px`);

    this.#overlayRef.updatePositionStrategy(this.#positionStrategy);
  }
}

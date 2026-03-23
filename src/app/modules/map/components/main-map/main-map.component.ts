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
import { DestinationElement } from '@modules/map/elements/destination/destination-element';
import { TrafficSignElement } from '@modules/map/elements/traffic-signs/traffic-sign-element';
import { BrtElement } from '@modules/map/elements/brt/brt-element';
import { AerialElement } from '@modules/map/elements/aerial/aerial-element';
import { AccessibilityFilterService, AccessibilityDataService, TrafficSignService } from '@shared/services';

import { SelectedTrafficSignsComponent } from '../traffic-signs/selected-traffic-signs';
import { MapBackgroundOption, MapDisplayComponent, MapButtonComponent } from '@ndwnu/design-system';
import { AccessibilityElement } from '@modules/map/elements/accessibility/accessibility-element';
import { MotorizedNoAccessElement } from '@modules/map/elements/motorized-no-access/motorized-no-access-element';
import { DrivingDirectionElement } from '@modules/map/elements/driving-direction/driving-direction-element';

const zoneCodeNames = { ZB: 'BEGIN', ZE: 'END', ZH: 'REPEAT' };

@Component({
  selector: 'ber-main-map',
  imports: [ControlPanelComponent, SelectedTrafficSignsComponent, MapDisplayComponent, MapButtonComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends MapComponent implements AfterViewInit {
  readonly #accessibilityFilterService = inject(AccessibilityFilterService);
  readonly #accessibilityDataService = inject(AccessibilityDataService);
  readonly #overlay = inject(Overlay);
  readonly #trafficSignService = inject(TrafficSignService);
  readonly #viewContainerRef = inject(ViewContainerRef);

  showControlPanel = input(true);
  openPanel = output();

  popupRef = viewChild.required<TemplateRef<SelectedTrafficSignsComponent>>('trafficSignsPopup');

  lngLat = computed(() => this.#trafficSignService.selectedTrafficSigns()?.[0].lnglat);

  backgroundOptions: MapBackgroundOption[] = [
    { id: 'brt', name: 'BRT', style: '', imageLink: 'assets/images/background-layer-icon/brt.jpg' },
    { id: 'aerial', name: 'Luchtfoto', style: '', imageLink: 'assets/images/background-layer-icon/aerial.jpg' },
  ];

  #overlayRef!: OverlayRef;
  #positionStrategy = this.#overlay.position().global();

  get trafficSignElement(): TrafficSignElement | undefined {
    return this.mapElements.find((element) => element instanceof TrafficSignElement);
  }

  constructor() {
    super();
    effect(() => {
      const templatePortal = new TemplatePortal(this.popupRef(), this.#viewContainerRef);
      this.#overlayRef?.detach();
      this.#updatePopupPosition();
      this.#overlayRef?.attach(templatePortal);
    });
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.#overlayRef = this.#overlay.create();

    this.map?.on('move', () => {
      this.#updatePopupPosition();
    });
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  protected async onLoadMap() {
    this.mapElements = [
      new BrtElement(this.map),
      new AerialElement(this.map),
      new MotorizedNoAccessElement(this.map, this.#accessibilityFilterService),
      new AccessibilityElement(this.map, this.#accessibilityDataService),
      new DrivingDirectionElement(this.map),
      new TrafficSignElement(this.map, this.#trafficSignService, this.#accessibilityFilterService),
      new DestinationElement(this.map, this.#accessibilityDataService),
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

  onBackgroundChange(backgroundOptions: MapBackgroundOption) {
    this.mapElements.find((element) => element instanceof BrtElement)?.setVisible(backgroundOptions.id === 'brt');
    this.mapElements.find((element) => element instanceof AerialElement)?.setVisible(backgroundOptions.id === 'aerial');
  }

  #initializeMapElements() {
    this.mapElements.forEach((element) => {
      element.onInit();
    });
    this.mapElements.find((element) => element instanceof TrafficSignElement)?.setVisible(true);
    this.mapElements.find((element) => element instanceof AccessibilityElement)?.setVisible(true);
    this.mapElements.find((element) => element instanceof MotorizedNoAccessElement)?.setVisible(true);
  }

  #loadImages() {
    this.loadImage('arrow-icon', 'assets/images/arrow.png');
    this.loadImage('black-arrow-icon', 'assets/images/black-arrow.png');
    const all_zones_signs = ['C1', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12'];
    const begin_end_signs = ['C17', 'C18', 'C19', 'C20', 'C21'];

    all_zones_signs.forEach((code) => {
      this.#loadSign(code);
      this.#loadSign(code, 'ZB');
      this.#loadSign(code, 'ZE');
      this.#loadSign(code, 'ZH');
    });

    begin_end_signs.forEach((code) => {
      this.#loadSign(code);
      this.#loadSign(code, 'ZB');
      this.#loadSign(code, 'ZE');
    });

    this.loadImage('C7a', 'assets/images/traffic-signs/C7a.png', { pixelRatio: 2 });
    this.loadImage('C7b', 'assets/images/traffic-signs/C7b.png', { pixelRatio: 2 });
    this.loadImage('C22c', 'assets/images/traffic-signs/C22c.png', { pixelRatio: 2 });
    this.loadImage('text-sign', 'assets/images/text-sign.png', { pixelRatio: 2 });
    this.loadImage('marker-negative', 'assets/images/marker-negative.png');
    this.loadImage('marker-positive', 'assets/images/marker-positive.png');
  }

  #loadSign(code: string, zoneCode?: 'ZB' | 'ZH' | 'ZE') {
    const imageName = zoneCode ? `${code}-${zoneCode}` : code;
    const path = zoneCode
      ? `assets/images/traffic-signs/${code}-${zoneCodeNames[zoneCode]}.png`
      : `assets/images/traffic-signs/${code}.png`;
    this.loadImage(imageName, path, { pixelRatio: 2.5 });
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

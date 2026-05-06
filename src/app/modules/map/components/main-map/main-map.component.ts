import { Component, inject, input, output } from '@angular/core';
import { MapComponent } from '@modules/map/components/map';
import { ControlPanelComponent } from '@modules/map/components/control-panel';
import { MapBackgroundOption, MapDisplayComponent, MapButtonComponent } from '@ndwnu/design-system';
import { BerMapElementRepository } from '@modules/map/elements/base/map-element-repository';
import { MapElementEnum } from '@modules/map/elements/base';
import { MapPopupComponent } from '../map-popup';

@Component({
  selector: 'ber-main-map',
  imports: [ControlPanelComponent, MapDisplayComponent, MapButtonComponent, MapPopupComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends MapComponent {
  readonly #berMapElementRepository = inject(BerMapElementRepository);

  showControlPanel = input(true);
  openPanel = output();

  backgroundOptions: MapBackgroundOption[] = [
    { id: MapElementEnum.BaseMap, name: 'NDW', style: '', imageLink: 'assets/images/background-layer-icon/brt.jpg' },
    {
      id: MapElementEnum.Aerial,
      name: 'Luchtfoto',
      style: '',
      imageLink: 'assets/images/background-layer-icon/aerial.jpg',
    },
  ];

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  handleTrafficSignVisible(visible: boolean) {
    this.#berMapElementRepository.setMapElementVisibility(MapElementEnum.TrafficSigns, visible);
  }

  onBackgroundChange(backgroundOption: MapBackgroundOption) {
    const baseMapVisible = backgroundOption.id === MapElementEnum.BaseMap;
    this.#berMapElementRepository.setMapElementVisibility(MapElementEnum.BaseMap, baseMapVisible);
    this.#berMapElementRepository.setMapElementVisibility(MapElementEnum.Aerial, !baseMapVisible);
  }

  protected onLoadMap() {
    this.#berMapElementRepository.registerMapElements(this.map);
    this.#loadImages();
  }

  #loadImages() {
    this.loadImage('arrow-icon', 'assets/images/arrow.png');
    this.loadImage('black-arrow-icon', 'assets/images/black-arrow.png');
    const allZonesSigns = ['C1', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12'];
    const beginEndSigns = ['C17', 'C18', 'C19', 'C20', 'C21'];

    allZonesSigns.forEach((code) => {
      this.#loadSign(code);
      this.#loadSign(code, 'ZB');
      this.#loadSign(code, 'ZE');
      this.#loadSign(code, 'ZH');
    });

    beginEndSigns.forEach((code) => {
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
    const zoneCodeNames = { ZB: 'BEGIN', ZE: 'END', ZH: 'REPEAT' };
    const imageName = zoneCode ? `${code}-${zoneCode}` : code;

    const path = zoneCode
      ? `assets/images/traffic-signs/${code}-${zoneCodeNames[zoneCode]}.png`
      : `assets/images/traffic-signs/${code}.png`;
    this.loadImage(imageName, path, { pixelRatio: 2.5 });
  }
}

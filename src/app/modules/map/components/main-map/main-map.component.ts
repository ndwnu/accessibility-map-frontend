import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapComponent } from '@modules/map/components/base-map/base-map.component';
import { AccessibilityElement } from '@modules/map/elements/accessibility/accessibility-element';
import { DestinationElement } from '@modules/map/elements/destination/destination-element';
import { TrafficSignElement } from '@modules/map/elements/traffic-signs/traffic-sign-element';
import { AccessibilityDataService, TrafficSignService } from '@shared/services';
import { DestinationDataService } from '@shared/services/destination-data.service';
import { SelectedTrafficSignsComponent } from '../traffic-signs/selected-traffic-signs/selected-traffic-signs.component';
import { NavigationControl } from 'maplibre-gl';
import { BrtElement } from '@modules/map/elements/brt/brt-element';
import { AerialElement } from '@modules/map/elements/aerial/aerial-element';
import { ControlPanelComponent } from '@modules/map/components/control-panel/control-panel.component';

@Component({
  selector: 'ber-main-map',
  standalone: true,
  imports: [CommonModule, SelectedTrafficSignsComponent, ControlPanelComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends BaseMapComponent {
  private readonly trafficSignService = inject(TrafficSignService);
  private readonly accessibilityDataService = inject(AccessibilityDataService);
  private readonly destinationDataService = inject(DestinationDataService);

  openPanel = output();
  showControlPanel = input(true);

  protected override addButtons() {
    this.map.addControl(new NavigationControl(), 'bottom-right');
  }

  protected async onLoadMap() {
    this.mapElements = [
      new BrtElement(this.map),
      new AerialElement(this.map),
      new AccessibilityElement(this.map, this.accessibilityDataService),
      new TrafficSignElement(this.map, this.trafficSignService, this.accessibilityDataService),
      new DestinationElement(this.map, this.destinationDataService),
    ];

    this.initializeMapElements();
    this.loadImages();
  }

  setBackgroundLayer(key: string) {
    this.mapElements.find((element) => element instanceof BrtElement)?.setVisible(key === 'brt');
    this.mapElements.find((element) => element instanceof AerialElement)?.setVisible(key === 'aerial');
  }

  get trafficSignElement(): TrafficSignElement | undefined {
    return this.mapElements.find((element) => element instanceof TrafficSignElement);
  }

  handleTrafficSignVisible(visible: boolean) {
    this.trafficSignElement?.setVisible(visible);
  }

  private initializeMapElements() {
    this.mapElements.forEach((element) => {
      element.onInit();
    });
    this.mapElements.find((element) => element instanceof TrafficSignElement)?.setVisible(false);
  }

  private loadImages() {
    this.loadImage('arrow-icon', 'assets/images/arrow.png');
    this.loadImage('C7a', 'assets/images/traffic-signs/C7a.png', { pixelRatio: 2 });
    this.loadImage('C7b', 'assets/images/traffic-signs/C7b.png', { pixelRatio: 2 });
    this.loadImage('C17', 'assets/images/traffic-signs/C17.png', { pixelRatio: 2 });
    this.loadImage('C18', 'assets/images/traffic-signs/C18.png', { pixelRatio: 2 });
    this.loadImage('C19', 'assets/images/traffic-signs/C19.png', { pixelRatio: 2 });
    this.loadImage('C20', 'assets/images/traffic-signs/C20.png', { pixelRatio: 2 });
    this.loadImage('C21', 'assets/images/traffic-signs/C21.png', { pixelRatio: 2 });
    this.loadImage('C22c', 'assets/images/traffic-signs/C22c.png', { pixelRatio: 2 });
    this.loadImage('text-sign', 'assets/images/text-sign.png', { pixelRatio: 2 });
    this.loadImage('marker', 'assets/images/marker-256.png');
  }
}

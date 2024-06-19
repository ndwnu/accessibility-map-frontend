import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapComponent } from '@modules/map/components/base-map/base-map.component';
import { AccessibilityElement } from '@modules/map/elements/accessibility/accessibility-element';
import { MapElement } from '@modules/map/elements/base';
import { AccessibilityDataService, TrafficSignService } from '@shared/services';
import { LegendComponent } from '../legend/legend.component';
import { TrafficSignElement } from '@modules/map/elements/traffic-signs/traffic-sign-element';
@Component({
  selector: 'ber-main-map',
  standalone: true,
  imports: [CommonModule, LegendComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends BaseMapComponent {
  mapElements: MapElement[] = [];

  private readonly trafficSignService = inject(TrafficSignService);
  private readonly accessibilityDataService = inject(AccessibilityDataService);

  protected async onLoadMap() {
    this.loadImages();

    this.mapElements = [
      new AccessibilityElement(this.map, this.accessibilityDataService),
      new TrafficSignElement(this.map, this.trafficSignService, this.accessibilityDataService),
    ];
  }

  get trafficSignElement(): TrafficSignElement | undefined {
    return this.mapElements.find((element) => element instanceof TrafficSignElement);
  }

  handleTrafficSignVisible(visible: boolean) {
    this.trafficSignElement?.setVisible(visible);
  }

  private loadImages() {
    this.loadImage('arrow-icon', 'assets/images/arrow.png');
    this.loadImage('C7a', 'assets/images/traffic-signs/C7a.png', { pixelRatio: 2 });
    this.loadImage('C7b', 'assets/images/traffic-signs/C7b.png', { pixelRatio: 2 });
    this.loadImage('C22c', 'assets/images/traffic-signs/C22c.png', { pixelRatio: 2 });
  }
}

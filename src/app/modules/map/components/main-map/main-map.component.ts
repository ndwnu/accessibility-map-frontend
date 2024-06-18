import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapComponent } from '@modules/map/components/base-map/base-map.component';
import { AccessibilityElement } from '@modules/map/elements/accessibility/accessibility-element';
import { MapElement } from '@modules/map/elements/base';
import { AccessibilityDataService } from '@shared/services';
import { LegendComponent } from '../legend/legend.component';
@Component({
  selector: 'ber-main-map',
  standalone: true,
  imports: [CommonModule, LegendComponent],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends BaseMapComponent {
  mapElements: MapElement[] = [];

  private readonly accessibilityDataService = inject(AccessibilityDataService);

  protected async onLoadMap() {
    this.loadArrowImage();

    this.mapElements = [new AccessibilityElement(this.map, this.accessibilityDataService)];
  }

  private loadArrowImage() {
    this.map.loadImage('assets/images/arrow.png', (error, image) => {
      if (!image || error) {
        console.error('Failed to load arrow image:', error);
        return;
      }

      this.map.addImage('arrow-icon', image);
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapComponent } from '@modules/map/components/base-map/base-map.component';
import { MapElement } from '@modules/map/elements/models';
import { AccessibilityElement } from '@modules/map/elements/accessibility-element';

@Component({
  selector: 'ber-main-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends BaseMapComponent {
  mapElements: MapElement[] = [];

  protected async onLoadMap() {
    this.loadArrowImage();

    this.mapElements = [new AccessibilityElement('ACCESSIBILITY', this.map)];

    this.mapElements.forEach((element) => {
      element.createSources();
      element.createLayers();
      element.setupClickHandlers();
    });
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

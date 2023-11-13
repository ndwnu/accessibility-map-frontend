import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMapComponent } from '@modules/map/components/main-map/main-map.component';

@Component({
  selector: 'ber-map',
  standalone: true,
  imports: [CommonModule, MainMapComponent],
  templateUrl: './map.component.html',
})
export class MapComponent {}

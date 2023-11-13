import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapComponent } from '@shared/components/base-map/base-map.component';

@Component({
  selector: 'ber-main-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
})
export class MainMapComponent extends BaseMapComponent {
  protected async onLoadMap() {}
}

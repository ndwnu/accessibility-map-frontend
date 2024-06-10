import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  ACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
} from '@modules/map/elements/constants';

@Component({
  selector: 'ber-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent {
  isLegendOpen = signal(false);
  legendItems = [
    { name: 'Bereikbare weg', color: ACCESSIBLE_ROAD_SECTION_COLOR },
    { name: 'Niet bereikbaar', subTitle: 'Uw voertuig mag hier niet rijden', color: INACCESSIBLE_ROAD_SECTION_COLOR },
    {
      name: 'Niet toegankelijk',
      subTitle: 'Wegvak niet toegankelijk voor gemotoriseerd verkeer',
      outlineColor: INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
    },
  ];

  toggleLegend() {
    this.isLegendOpen.set(!this.isLegendOpen());
  }
}

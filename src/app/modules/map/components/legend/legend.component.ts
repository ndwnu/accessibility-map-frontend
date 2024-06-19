import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import {
  ACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
} from '@modules/map/elements/constants';
import { IconComponent } from '@ndwnu/design-system';

interface ILegendItem {
  name: string;
  subTitle?: string;
  img?: string;
  color?: string;
  outlineColor?: string;
  toggleable?: boolean;
}

@Component({
  selector: 'ber-legend',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent {
  isLegendOpen = signal(false);
  isTrafficSignVisible = signal(true);

  onTrafficSignVisible = output<boolean>();

  legendItems: ILegendItem[] = [
    { name: 'Bereikbare weg', color: ACCESSIBLE_ROAD_SECTION_COLOR },
    { name: 'Niet bereikbaar', subTitle: 'Uw voertuig mag hier niet rijden', color: INACCESSIBLE_ROAD_SECTION_COLOR },
    {
      name: 'Niet toegankelijk',
      subTitle: 'Wegvak niet toegankelijk voor gemotoriseerd verkeer',
      outlineColor: INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
    },
    { name: 'Verkeersborden', img: 'assets/images/traffic-signs/C7a.png', toggleable: true },
  ];

  toggleLegend() {
    this.isLegendOpen.set(!this.isLegendOpen());
  }

  toggleTrafficSign() {
    this.isTrafficSignVisible.set(!this.isTrafficSignVisible());
    this.onTrafficSignVisible.emit(this.isTrafficSignVisible());
  }
}

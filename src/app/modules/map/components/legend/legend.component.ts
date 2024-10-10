import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  ACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
} from '@modules/map/elements/constants';

interface ILegendItem {
  name: string;
  subTitle?: string;
  img?: string;
  color?: string;
  outlineColor?: string;
}

@Component({
  selector: 'ber-legend',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.scss',
})
export class LegendComponent {
  legendItems: ILegendItem[] = [
    { name: 'Bereikbare weg', color: ACCESSIBLE_ROAD_SECTION_COLOR },
    { name: 'Niet bereikbaar', subTitle: 'Uw voertuig mag hier niet rijden', color: INACCESSIBLE_ROAD_SECTION_COLOR },
    {
      name: 'Niet toegankelijk',
      subTitle: 'Wegvak niet toegankelijk voor gemotoriseerd verkeer',
      color: INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
    },
    { name: 'Verkeersborden', img: 'assets/images/traffic-signs/C7a.png' },
  ];
}

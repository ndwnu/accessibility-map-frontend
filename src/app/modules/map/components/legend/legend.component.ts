import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  ACCESSIBLE_EZ_BUT_NOT_RVV_COLOR,
  ACCESSIBLE_ROAD_SECTION_COLOR,
  ACCESSIBLE_RVV_BUT_NOT_EZ_COLOR,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
} from '@modules/map/elements/constants';

interface ILegendItem {
  name: string;
  subTitle?: string;
  img?: string;
  color?: string;
  outlineColor?: string;
}

const LEGEND_ACCESSIBLE: ILegendItem = {
  name: 'Bereikbare weg',
  color: ACCESSIBLE_ROAD_SECTION_COLOR,
};
const LEGEND_INACCESSIBLE: ILegendItem = {
  name: 'Niet bereikbaar',
  subTitle: 'Uw voertuig mag hier niet rijden',
  color: INACCESSIBLE_ROAD_SECTION_COLOR,
};
const LEGEND_INACCESSIBLE_CARRIAGEWAY: ILegendItem = {
  name: 'Niet toegankelijk',
  subTitle: 'Wegvak niet toegankelijk voor gemotoriseerd verkeer',
  color: INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
};
const LEGEND_TRAFFIC_SIGNS: ILegendItem = {
  name: 'Verkeersborden',
  img: 'assets/images/traffic-signs/C7a.png',
};
const LEGEND_EMISSION_ZONE: ILegendItem = {
  name: 'Emissiezone',
  subTitle: 'Wegvak niet toegankelijk vanwege milieuzone',
  color: ACCESSIBLE_RVV_BUT_NOT_EZ_COLOR,
};
const LEGEND_RVV: ILegendItem = {
  name: 'Afmetingen/gewicht',
  subTitle: 'Wegvak niet toegankelijk vanwege overige beperkingen',
  color: ACCESSIBLE_EZ_BUT_NOT_RVV_COLOR,
};

@Component({
  selector: 'ber-legend',
  imports: [NgOptimizedImage],
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.scss',
})
export class LegendComponent {
  showDetailedAccessibility = input.required<boolean>();

  legendItems = computed(() => {
    if (this.showDetailedAccessibility()) {
      return [
        LEGEND_ACCESSIBLE,
        LEGEND_INACCESSIBLE,
        LEGEND_EMISSION_ZONE,
        LEGEND_RVV,
        LEGEND_INACCESSIBLE_CARRIAGEWAY,
        LEGEND_TRAFFIC_SIGNS,
      ];
    } else {
      return [LEGEND_ACCESSIBLE, LEGEND_INACCESSIBLE, LEGEND_INACCESSIBLE_CARRIAGEWAY, LEGEND_TRAFFIC_SIGNS];
    }
  });
}

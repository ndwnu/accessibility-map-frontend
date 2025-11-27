import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { environment } from '@env/environment';
import {
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  IconComponent,
  TooltipDirective,
} from '@ndwnu/design-system';
import { TrafficSign } from '@shared/models/traffic-sign.model';
import { TrafficSignOrientationPipe } from '@shared/pipes';
import { TrafficSignService } from '@shared/services';
import { RoadOperatorService } from '@shared/services/road-operator.service';

@Component({
  selector: 'ber-selected-traffic-signs',
  imports: [
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    IconComponent,
    TooltipDirective,
    TrafficSignOrientationPipe,
  ],
  templateUrl: './selected-traffic-signs.component.html',
  styleUrl: './selected-traffic-signs.component.scss',
})
export class SelectedTrafficSignsComponent implements OnInit {
  private readonly roadOperatorService = inject(RoadOperatorService);
  private readonly trafficSignService = inject(TrafficSignService);

  closed = output();

  selectedTrafficSigns = this.trafficSignService.selectedTrafficSigns;
  trafficSign = signal<TrafficSign | undefined>(undefined);

  streetviewUrl = computed(
    () =>
      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${
        this.trafficSign()?.lnglat?.lat
      },${this.trafficSign()?.lnglat?.lng}`,
  );
  georgeTrafficSignUrl = computed(
    () => `${environment.georgeUrl}/kaart/verkeersborden/${this.trafficSign()?.id}?zoom=true`,
  );
  georgeRoadSectionUrl = computed(() => {
    return this.trafficSign()?.roadSectionId
      ? `${environment.georgeUrl}/kaart/wegvakken/${
          this.trafficSign()?.roadSectionId
        }/kenmerken/maximumsnelheid?zoom=true`
      : undefined;
  });
  rvvExemptionUrl = computed(() => {
    const roadOperator = this.roadOperatorService.getRoadOperator(this.trafficSign()?.countyCode ?? '');
    return roadOperator?.requestExemptionUrl ?? '';
  });

  ngOnInit() {
    const trafficSigns = this.selectedTrafficSigns();
    if (trafficSigns?.length === 1) {
      this.setTrafficSign(trafficSigns[0].id);
    }
  }

  close() {
    this.trafficSignService.setSelectedTrafficSigns(undefined);
    this.closed.emit();
  }

  setTrafficSign(id: string) {
    this.trafficSign.set(this.selectedTrafficSigns()?.find((trafficSign) => trafficSign.id === id));
  }

  showAll() {
    this.trafficSign.set(undefined);
  }
}

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
import { MunicipalityService, TrafficSignService } from '@shared/services';

@Component({
  selector: 'ber-selected-traffic-signs',
  standalone: true,
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
  private readonly trafficSignService = inject(TrafficSignService);
  private readonly municipalityService = inject(MunicipalityService);

  onClose = output();

  selectedTrafficSigns = this.trafficSignService.selectedTrafficSigns;
  trafficSign = signal<TrafficSign | undefined>(undefined);

  streetviewUrl = computed(
    () =>
      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${this.trafficSign()?.lnglat
        ?.lat},${this.trafficSign()?.lnglat?.lng}`,
  );
  georgeTrafficSignUrl = computed(() => `${environment.georgeUrl}/verkeersborden/${this.trafficSign()?.id}`);
  georgeRoadSectionUrl = computed(
    () => `${environment.georgeUrl}/wegkenmerken/wegvakken/${this.trafficSign()?.wvkId}?zoom=true`,
  );
  rvvExemptionUrl = computed(() => {
    const municipality = this.municipalityService.getMunicipality(this.trafficSign()?.countyCode ?? '');
    return municipality?.properties?.requestExemptionUrl ?? '';
  });

  ngOnInit() {
    const trafficSigns = this.selectedTrafficSigns();
    if (trafficSigns?.length === 1) {
      this.setTrafficSign(trafficSigns[0].id);
    }
  }

  close() {
    this.trafficSignService.setSelectedTrafficSigns(undefined);
    this.onClose.emit();
  }

  navigateToRvvExemption() {
    window.open(this.rvvExemptionUrl(), '_blank');
  }

  setTrafficSign(id: string) {
    this.trafficSign.set(this.selectedTrafficSigns()?.find((trafficSign) => trafficSign.id === id));
  }

  showAll() {
    this.trafficSign.set(undefined);
  }
}

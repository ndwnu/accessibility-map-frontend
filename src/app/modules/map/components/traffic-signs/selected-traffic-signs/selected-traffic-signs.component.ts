import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { CardComponent, IconComponent } from '@ndwnu/design-system';
import { TrafficSignOrientationPipe } from '@shared/pipes';
import { MunicipalityService, TrafficSignService } from '@shared/services';

@Component({
  selector: 'ber-selected-traffic-signs',
  standalone: true,
  imports: [CommonModule, CardComponent, IconComponent, TrafficSignOrientationPipe],
  templateUrl: './selected-traffic-signs.component.html',
  styleUrl: './selected-traffic-signs.component.scss',
})
export class SelectedTrafficSignsComponent {
  private readonly trafficSignService = inject(TrafficSignService);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly destroyRef = inject(DestroyRef);

  selectedTrafficSigns = toSignal(this.trafficSignService.selectedTrafficSigns$);
  selectIndex = signal(0);
  trafficSign = computed(() => this.selectedTrafficSigns()?.[this.selectIndex()]);

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

  constructor() {
    this.trafficSignService.selectedTrafficSigns$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.selectIndex.set(0);
    });
  }

  previous() {
    if (this.selectIndex() > 0) {
      this.selectIndex.update((i) => i - 1);
    }
  }

  next() {
    const selectedTrafficSigns = this.selectedTrafficSigns();
    if (selectedTrafficSigns && this.selectIndex() < selectedTrafficSigns.length - 1) {
      this.selectIndex.update((i) => i + 1);
    }
  }

  close() {
    this.trafficSignService.setSelectedTrafficSigns(undefined);
  }

  navigateToRvvExemption() {
    window.open(this.rvvExemptionUrl(), '_blank');
  }
}

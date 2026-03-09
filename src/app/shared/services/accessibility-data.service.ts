import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { AccessibilityFilter } from '@shared/models';
import { DestinationProperties } from '@shared/models/destination.model';
import { AccessibilityDataOldService } from '@shared/services/accessibility-data-old.service';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject, tap } from 'rxjs';

export enum DetailOption {
  Vehicle = 'vehicle',
  Emission = 'emission',
}

@Injectable({
  providedIn: 'root',
})
export class AccessibilityDataService {
  readonly #http = inject(HttpClient);
  readonly #accessibilityDataOldService = inject(AccessibilityDataOldService);
  readonly #baseURL = environment.ndw.accessibilityUrl;

  roadAccessibilityBS = new BehaviorSubject<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });
  roadAccessibility$ = this.roadAccessibilityBS.asObservable();
  roadAccessibility = toSignal(this.roadAccessibility$);

  destinationResults = computed(() => {
    const destinationFeature = this.roadAccessibility()?.features.find(
      (feature) => feature.properties?.type === 'destination',
    );
    return destinationFeature ? (destinationFeature.properties as DestinationProperties) : undefined;
  });

  readonly #currentFilter = signal<AccessibilityFilter | undefined>(undefined);

  showDetailedAccessibility = signal(false);

  selectedDetailValue = signal(DetailOption.Vehicle);

  constructor() {
    effect(() => {
      const filter = this.#currentFilter();
      const showDetails = this.showDetailedAccessibility();
      const detailValue = this.selectedDetailValue();

      if (!filter) {
        return;
      }

      const options = showDetails ? { showDisclaimer: false, details: detailValue } : { showDisclaimer: false };

      this.#fetchRoadAccessibility(filter, options).subscribe();
    });
  }

  getRoadAccessibility(filter: AccessibilityFilter, options?: { showDisclaimer: boolean; details?: DetailOption }) {
    this.#currentFilter.set(filter);
    return this.#fetchRoadAccessibility(filter, options);
  }

  #fetchRoadAccessibility(filter: AccessibilityFilter, options?: { showDisclaimer: boolean; details?: DetailOption }) {
    this.roadAccessibilityBS.next({ type: 'FeatureCollection', features: [] });

    const vehicle: Record<string, unknown> = {
      type: filter.vehicleType,
    };

    if (options?.details !== DetailOption.Emission) {
      vehicle.width = filter.vehicleWidth;
      vehicle.height = filter.vehicleHeight;
      vehicle.weight = filter.vehicleWeight;
      vehicle.length = filter.vehicleLength;
      vehicle.axleLoad = filter.vehicleAxleLoad;
      vehicle.hasTrailer = filter.vehicleHasTrailer;
    }

    if (options?.details !== DetailOption.Vehicle) {
      vehicle.emissionClass = filter.emissionClass;
      vehicle.fuelTypes = filter.fuelTypes;
    }

    const body: Record<string, unknown> = {
      area: {
        type: 'municipality',
        id: filter.municipalityId,
      },
      vehicle,
    };

    if (filter.latitude !== undefined && filter.longitude !== undefined) {
      body.destination = {
        latitude: filter.latitude,
        longitude: filter.longitude,
      };
    }

    return this.#http
      .post<FeatureCollection>(`${this.#baseURL}/accessibility.geojson`, body, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/geo+json',
        },
      })
      .pipe(
        tap((data) => {
          this.roadAccessibilityBS.next(data);
          if (options?.showDisclaimer) {
            this.#accessibilityDataOldService.showDisclaimer$.next();
          }
        }),
      );
  }
}

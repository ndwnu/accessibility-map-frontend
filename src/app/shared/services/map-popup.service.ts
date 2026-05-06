import { effect, inject, Injectable, signal } from '@angular/core';
import { TrafficSign } from '@shared/models/traffic-sign.model';
import { TrafficSignService } from './traffic-sign.service';
import { LngLat } from 'maplibre-gl';

export enum ActivePopupMode {
  Destination = 'destination',
  TrafficSign = 'trafficSign',
}

export type ActivePopup =
  | { type: ActivePopupMode.Destination; lngLat: { lng: number; lat: number } }
  | { type: ActivePopupMode.TrafficSign; lngLat: { lng: number; lat: number }; signs: TrafficSign[] }
  | undefined;

@Injectable({ providedIn: 'root' })
export class MapPopupService {
  readonly #trafficSignService = inject(TrafficSignService);

  readonly #activePopup = signal<ActivePopup>(undefined);
  activePopup = this.#activePopup.asReadonly();

  constructor() {
    effect(() => {
      const signs = this.#trafficSignService.selectedTrafficSigns();
      if (signs && signs?.length > 0) {
        const firstSign = signs[0];
        this.openTrafficSignPopup(firstSign.lnglat, signs);
      } else {
        this.closePopup();
      }
    });
  }

  openDestinationPopup(lngLat: LngLat) {
    this.#activePopup.set({ type: ActivePopupMode.Destination, lngLat });
  }

  openTrafficSignPopup(lngLat: LngLat, signs: TrafficSign[]) {
    this.#activePopup.set({ type: ActivePopupMode.TrafficSign, lngLat, signs });
  }

  closePopup() {
    this.#activePopup.set(undefined);
  }
}

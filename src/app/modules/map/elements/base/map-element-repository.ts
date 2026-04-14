import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccessibilityElement } from '@modules/map/elements/accessibility/accessibility-element';
import { MapElementEnum } from '@modules/map/elements/base/map-element.enum';
import { DrivingDirectionElement } from '@modules/map/elements/driving-direction/driving-direction-element';
import { MotorizedNoAccessElement } from '@modules/map/elements/motorized-no-access/motorized-no-access-element';
import { NdwAerialElement } from '@modules/map/elements/ndw/ndw-aerial-element';
import { NdwBaseElement } from '@modules/map/elements/ndw/ndw-base-element';
import { NdwLabelsElement } from '@modules/map/elements/ndw/ndw-labels-element';
import { TrafficSignElement } from '@modules/map/elements/traffic-sign/traffic-sign-element';
import { MapElementRepository, MaplibreCursorService } from '@ndwnu/map';
import { AccessibilityDataService, AccessibilityFilterService, TrafficSignService } from '@shared/services';
import { Map } from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class BerMapElementRepository extends MapElementRepository<MapElementEnum> {
  readonly #accessibilityDataService = inject(AccessibilityDataService);
  readonly #accessibilityFilterService = inject(AccessibilityFilterService);
  readonly #http = inject(HttpClient);
  readonly #maplibreCursorService = inject(MaplibreCursorService);
  readonly #trafficSignService = inject(TrafficSignService);

  registerMapElements(mapObject: Map) {
    const mapElementConfig = {
      map: mapObject,
      mapElementRepository: this,
      maplibreCursorService: this.#maplibreCursorService,
    };

    [
      new NdwBaseElement({ ...mapElementConfig, elementId: MapElementEnum.BaseMap, elementOrder: 0 }, this.#http),
      new NdwAerialElement({ ...mapElementConfig, elementId: MapElementEnum.Aerial, elementOrder: 0 }, this.#http),
      new MotorizedNoAccessElement(
        { ...mapElementConfig, elementId: MapElementEnum.MotorizedNoAccess, elementOrder: 50 },
        this.#accessibilityFilterService,
      ),
      new AccessibilityElement(
        { ...mapElementConfig, elementId: MapElementEnum.Accessibility, elementOrder: 50 },
        this.#accessibilityDataService,
      ),
      new DrivingDirectionElement({
        ...mapElementConfig,
        elementId: MapElementEnum.DrivingDirection,
        elementOrder: 75,
      }),
      new NdwLabelsElement({ ...mapElementConfig, elementId: MapElementEnum.Labels, elementOrder: 90 }, this.#http),
      new TrafficSignElement(
        { ...mapElementConfig, elementId: MapElementEnum.TrafficSigns, elementOrder: 100 },
        this.#trafficSignService,
        this.#accessibilityFilterService,
      ),
    ].forEach((element) => this.addMapElement(element));
  }
}

import { inject, Injectable } from '@angular/core';
import { AccessibilityFilter, RoadOperator } from '@shared/models';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { PdokLookupService } from '@shared/services/pdok-lookup.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityDataOldService {
  readonly #pdokLookupService = inject(PdokLookupService);

  selectedMunicipalityId$ = toObservable(this.#pdokLookupService.municipalityId);

  private readonly roadOperator = new BehaviorSubject<RoadOperator | undefined>(undefined);
  roadOperator$ = this.roadOperator.asObservable();

  private readonly _filter = new BehaviorSubject<AccessibilityFilter | undefined>(undefined);
  filter$ = this._filter.asObservable();
  filterContainsCoordinates$ = this.filter$.pipe(map((filter) => filter?.latitude && filter?.longitude));

  showDisclaimer$ = new Subject<void>();
  private readonly showDetailedAccessibility = new BehaviorSubject<boolean>(false);
  showDetailedAccessibility$ = this.showDetailedAccessibility.asObservable();

  get filter(): AccessibilityFilter | undefined {
    return this._filter.value;
  }

  setFilter(filter: AccessibilityFilter) {
    this._filter.next(filter);
  }

  setRoadOperator(roadOperator: RoadOperator) {
    this.roadOperator.next(roadOperator);
  }

  setShowDetailedAccessibility(showDetailedAccessibility: boolean) {
    this.showDetailedAccessibility.next(showDetailedAccessibility);
  }

  getRvvCodes(filter: AccessibilityFilter | undefined) {
    const defaultRvvCodes = ['C1', 'C6', 'C12', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22a', 'C22b'];

    const vehicleSpecificRvvCodes: string[] = defaultRvvCodes;

    switch (filter?.vehicleType) {
      case 'truck':
        vehicleSpecificRvvCodes.push(...['C7', 'C7b', 'C22c', 'C22d']);
        break;
      case 'light_commercial_vehicle':
        vehicleSpecificRvvCodes.push(...['C22c', 'C22d']);
        break;
      case 'bus':
        vehicleSpecificRvvCodes.push(...['C7a', 'C7b']);
        break;
      case 'tractor':
        vehicleSpecificRvvCodes.push(...['C8', 'C9']);
        break;
      case 'motorcycle':
        vehicleSpecificRvvCodes.push(...['C11']);
        break;
      default:
        break;
    }

    if (filter?.vehicleHasTrailer) {
      vehicleSpecificRvvCodes.push('C10');
    }

    return vehicleSpecificRvvCodes;
  }
}

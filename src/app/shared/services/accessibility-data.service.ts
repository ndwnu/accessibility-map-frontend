import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import {
  AccessibilityFilter,
  InaccessibleRoadSection,
  InaccessibleRoadSectionsResponse,
  RoadOperator,
} from '@shared/models';
import { BehaviorSubject, forkJoin, map, Observable, shareReplay, Subject } from 'rxjs';
import { CalculatedAccessibility } from '@shared/models/calculated.accessibility';

export function isAccessibleSection(section: InaccessibleRoadSection): boolean {
  return !!section.forwardAccessible || !!section.backwardAccessible;
}

@Injectable({
  providedIn: 'root',
})
export class AccessibilityDataService {
  private readonly _dataInputService = inject(DataInputService);
  private readonly _http = inject(HttpClient);
  baseURL = environment.ndw.accessibilityUrl;

  private readonly selectedMunicipalityId = new BehaviorSubject<string | undefined>(undefined);
  selectedMunicipalityId$ = this.selectedMunicipalityId.asObservable();

  private readonly inaccessibleRoadSections = new BehaviorSubject<CalculatedAccessibility[]>([]);
  inaccessibleRoadSections$ = this.inaccessibleRoadSections.asObservable();

  private readonly matchedRoadSection = new BehaviorSubject<InaccessibleRoadSection | undefined>(undefined);
  matchedRoadSection$ = this.matchedRoadSection.asObservable();

  private readonly roadOperator = new BehaviorSubject<RoadOperator | undefined>(undefined);
  roadOperator$ = this.roadOperator.asObservable();

  private readonly _filter = new BehaviorSubject<AccessibilityFilter | undefined>(undefined);
  filter$ = this._filter.asObservable();
  filterContainsCoordinates$ = this.filter$.pipe(map((filter) => filter?.latitude && filter?.longitude));

  roadSectionInaccessible$ = this.matchedRoadSection$.pipe(
    map((roadSection) => !roadSection?.backwardAccessible && !roadSection?.forwardAccessible),
    map((inaccessible) => inaccessible && this._dataInputService.pdokData?.type !== 'gemeente'),
  );

  showDisclaimer$ = new Subject<void>();
  private readonly showDetailedAccessibility = new BehaviorSubject<boolean>(false);
  showDetailedAccessibility$ = this.showDetailedAccessibility.asObservable();

  get filter(): AccessibilityFilter | undefined {
    return this._filter.value;
  }

  getInaccessibleRoadSections(
    filter: AccessibilityFilter,
    geoJSON = false,
  ): Observable<[InaccessibleRoadSectionsResponse, InaccessibleRoadSectionsResponse]> {
    this._filter.next(filter);

    const municipalityId = filter.municipalityId;
    const geojson = geoJSON ? '.geojson' : '';

    let params = new HttpParams();
    let ezParams = new HttpParams();
    Object.keys(filter)
      .filter((key) => key !== 'municipalityId')
      .forEach((key) => {
        const filterValue = filter[key as keyof AccessibilityFilter];
        if (filterValue && key !== 'emissionClass' && key !== 'fuelTypes') {
          params = params.append(key, filterValue.toString());
        }
        if (
          filterValue &&
          (key === 'vehicleType' ||
            key === 'emissionClass' ||
            key === 'fuelTypes' ||
            key === 'latitude' ||
            key === 'longitude')
        ) {
          ezParams = ezParams.append(key, filterValue.toString());
        }
      });

    const url = `${this.baseURL}/municipalities/${municipalityId}/road-sections${geojson}`;

    const basicResponse = this._http.get<InaccessibleRoadSectionsResponse>(url, { params }).pipe(shareReplay(1));
    if (ezParams.has('fuelTypes') || ezParams.has('emissionClass')) {
      const ezResponse = this._http
        .get<InaccessibleRoadSectionsResponse>(url, { params: ezParams })
        .pipe(shareReplay(1));
      return forkJoin([basicResponse, ezResponse]);
    } else {
      return forkJoin([basicResponse, basicResponse]);
    }
  }

  setInaccessibleRoadSectionsDetailed(
    rvvInaccessible: InaccessibleRoadSection[],
    ezInaccessible: InaccessibleRoadSection[],
  ) {
    // Create a map for quick lookup of EZ sections by roadSectionId
    const ezMap = new Map<number, InaccessibleRoadSection>();
    ezInaccessible.forEach((ez) => ezMap.set(ez.roadSectionId, ez));

    // Create a map for quick lookup of RVV sections by roadSectionId
    const rvvMap = new Map<number, InaccessibleRoadSection>();
    rvvInaccessible.forEach((rvv) => rvvMap.set(rvv.roadSectionId, rvv));

    // Get all unique road section IDs from both datasets
    const allRoadSectionIds = new Set([
      ...rvvInaccessible.map((section) => section.roadSectionId),
      ...ezInaccessible.map((section) => section.roadSectionId),
    ]);

    // Process each road section
    const detailedAccessibility: CalculatedAccessibility[] = Array.from(allRoadSectionIds).map((roadSectionId) => {
      const rvvSection = rvvMap.get(roadSectionId);
      const ezSection = ezMap.get(roadSectionId);

      // Determine inaccessibility for each regulation type
      const rvvInaccessible = rvvSection ? !isAccessibleSection(rvvSection) : false; // If no RVV restriction, not inaccessible
      const ezInaccessible = ezSection ? !isAccessibleSection(ezSection) : false; // If no EZ restriction, not inaccessible

      // A road section is inaccessible if it's inaccessible under EITHER regulation
      const overallInaccessible = rvvInaccessible || ezInaccessible;

      return {
        roadSectionId,
        inaccessible: overallInaccessible,
        inaccessible_rvv: rvvInaccessible,
        inaccessible_ez: ezInaccessible,
      };
    });

    // Update the behavior subject with the calculated accessibility data
    this.inaccessibleRoadSections.next(detailedAccessibility);
  }

  setMatchedRoadSection(matchedRoadSection: InaccessibleRoadSection | undefined) {
    this.matchedRoadSection.next(matchedRoadSection);
  }

  setRoadOperator(roadOperator: RoadOperator) {
    this.roadOperator.next(roadOperator);
  }

  setSelectedMunicipalityId(municipalityId: string) {
    this.selectedMunicipalityId.next(municipalityId);
  }

  setShowDetailedAccessibility(showDetailedAccessibility: boolean) {
    this.showDetailedAccessibility.next(showDetailedAccessibility);
  }

  getRvvCodes(filter: AccessibilityFilter | undefined) {
    const defaultRvvCodes = ['C1', 'C2', 'C3', 'C6', 'C12', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22a', 'C22b'];

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

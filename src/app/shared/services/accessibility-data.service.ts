import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { AccessibilityFilter, InaccessibleRoadSection, InaccessibleRoadSectionsResponse } from '@shared/models';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityDataService {
  private readonly _dataInputService = inject(DataInputService);
  private readonly _http = inject(HttpClient);
  baseURL = environment.ndw.accessibilityUrl;

  private readonly selectedMunicipalityId = new BehaviorSubject<string | undefined>(undefined);
  selectedMunicipalityId$ = this.selectedMunicipalityId.asObservable();

  private readonly inaccessibleRoadSections = new BehaviorSubject<InaccessibleRoadSection[]>([]);
  inaccessibleRoadSections$ = this.inaccessibleRoadSections.asObservable();

  private readonly matchedRoadSection = new BehaviorSubject<InaccessibleRoadSection | undefined>(undefined);
  matchedRoadSection$ = this.matchedRoadSection.asObservable();

  private readonly _filter = new BehaviorSubject<AccessibilityFilter | undefined>(undefined);
  filter$ = this._filter.asObservable();
  filterContainsCoordinates$ = this.filter$.pipe(map((filter) => filter?.latitude && filter?.longitude));

  roadSectionInaccessible$ = this.matchedRoadSection$.pipe(
    map((roadSection) => !roadSection?.backwardAccessible && !roadSection?.forwardAccessible),
    map((inaccessible) => inaccessible && this._dataInputService.pdokData?.type !== 'gemeente'),
  );

  showDisclaimer$ = new Subject<void>();

  get filter(): AccessibilityFilter | undefined {
    return this._filter.value;
  }

  getInaccessibleRoadSections(
    filter: AccessibilityFilter,
    geoJSON = false,
  ): Observable<InaccessibleRoadSectionsResponse> {
    this._filter.next(filter);

    const municipalityId = filter.municipalityId;
    const geojson = geoJSON ? '.geojson' : '';

    let params = new HttpParams();
    Object.keys(filter)
      .filter((key) => key !== 'municipalityId')
      .forEach((key) => {
        const filterValue = filter[key as keyof AccessibilityFilter];
        if (filterValue) {
          params = params.append(key, filterValue.toString());
        }
      });

    const url = `${this.baseURL}/municipalities/${municipalityId}/road-sections${geojson}`;

    return this._http.get<InaccessibleRoadSectionsResponse>(url, { params });
  }

  setInaccessibleRoadSections(inaccessibleRoadSections: InaccessibleRoadSection[]) {
    this.inaccessibleRoadSections.next(inaccessibleRoadSections);
  }

  setMatchedRoadSection(matchedRoadSection: InaccessibleRoadSection | undefined) {
    this.matchedRoadSection.next(matchedRoadSection);
  }

  setSelectedMunicipalityId(municipalityId: string) {
    this.selectedMunicipalityId.next(municipalityId);
  }

  getRvvCodes(filter: AccessibilityFilter | undefined) {
    const defaultRvvCodes = ['C6', 'C12', 'C17', 'C18', 'C19', 'C20', 'C21'];

    const vehicleSpecificRvvCodes: string[] = defaultRvvCodes;

    switch (filter?.vehicleType) {
      case 'truck':
        vehicleSpecificRvvCodes.push(...['C7', 'C7b', 'C22c']);
        break;
      case 'light_commercial_vehicle':
        vehicleSpecificRvvCodes.push(...['C22c']);
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

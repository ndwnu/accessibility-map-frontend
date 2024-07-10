import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { AccessibilityFilter, InaccessibleRoadSection, InaccessibleRoadSectionsResponse } from '@shared/models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityDataService {
  private readonly _http = inject(HttpClient);
  baseURL = environment.nls.accessibilityUrl;

  private selectedMunicipalityId = new BehaviorSubject<string | undefined>(undefined);
  selectedMunicipalityId$ = this.selectedMunicipalityId.asObservable();

  private inaccessibleRoadSections = new BehaviorSubject<InaccessibleRoadSection[]>([]);
  inaccessibleRoadSections$ = this.inaccessibleRoadSections.asObservable();

  showDisclaimer$ = new Subject<void>();

  getInaccessibleRoadSections(filter: AccessibilityFilter): Observable<InaccessibleRoadSectionsResponse> {
    const municipalityId = filter.municipalityId;

    let params = new HttpParams();
    Object.keys(filter)
      .filter((key) => key !== 'municipalityId')
      .forEach((key) => {
        const filterValue = filter[key as keyof AccessibilityFilter];
        if (filterValue) {
          params = params.append(key, filterValue.toString());
        }
      });

    const url = `${this.baseURL}/municipalities/${municipalityId}/road-sections`;

    return this._http.get<InaccessibleRoadSectionsResponse>(url, { params });
  }

  setInaccessibleRoadSections(inaccessibleRoadSections: InaccessibleRoadSection[]) {
    this.inaccessibleRoadSections.next(inaccessibleRoadSections);
  }

  setSelectedMunicipalityId(municipalityId: string) {
    this.selectedMunicipalityId.next(municipalityId);
  }
}

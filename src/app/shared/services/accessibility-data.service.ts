import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import {
  AccessibilityFilter,
  InaccessibleRoadSectionsResponse,
  MuncipalityFeature,
  MuncipalityFeatureCollection,
} from '@shared/models';
import { Observable, map } from 'rxjs';

@Injectable()
export class AccessibilityDataService {
  private readonly _http = inject(HttpClient);
  baseURL = environment.nls.accessibilityUrl;

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

  getMunicipalities(): Observable<MuncipalityFeature[]> {
    return this._http
      .get<MuncipalityFeatureCollection>(`${this.baseURL}/municipalities`)
      .pipe(map((response) => response.features));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { MuncipalityFeature, MuncipalityFeatureCollection } from '@shared/models';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MunicipalityService {
  private readonly _http = inject(HttpClient);
  private readonly baseURL = environment.nls.accessibilityUrl;
  private cachedMunicipalities: MuncipalityFeature[] | undefined;

  getMunicipalities() {
    if (this.cachedMunicipalities) {
      return of(this.cachedMunicipalities);
    }

    const url = `${this.baseURL}/municipalities`;
    return this._http.get<MuncipalityFeatureCollection>(url).pipe(
      map((response) => response.features),
      tap((data) => {
        this.cachedMunicipalities = data;
      }),
    );
  }

  getSyncMunicipality(municipalityId: string): MuncipalityFeature | undefined {
    return this.cachedMunicipalities?.find((f) => f.id === municipalityId);
  }
}

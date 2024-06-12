import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MuncipalityFeature, MuncipalityFeatureCollection } from '@shared/models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MunicipalityService {
  private readonly _http = inject(HttpClient);
  private readonly baseURL = environment.nls.accessibilityUrl;
  private cachedMunicipalities: MuncipalityFeature[] | undefined;

  loadMunicipalities() {
    const url = `${this.baseURL}/municipalities`;
    this._http
      .get<MuncipalityFeatureCollection>(url)
      .pipe(map((response) => response.features))
      .subscribe((data) => {
        this.cachedMunicipalities = data;
      });
  }

  getMunicipality(municipalityId: string): MuncipalityFeature | undefined {
    return this.cachedMunicipalities?.find((f) => f.id === municipalityId);
  }
}

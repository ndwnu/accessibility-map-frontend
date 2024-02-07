import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { MuncipalityFeatureCollection } from '@shared/models';

@Injectable()
export class MunicipalityService {
  private readonly _http = inject(HttpClient);
  private readonly baseURL = environment.accessibilityUrl;

  getMunicipalityFeatures() {
    const url = `${this.baseURL}/municipalities`;
    return this._http.get<MuncipalityFeatureCollection>(url);
  }
}

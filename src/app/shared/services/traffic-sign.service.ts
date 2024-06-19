import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { TrafficSignFeatureCollection } from '@shared/models/traffic-sign.model';
import { FeatureCollection } from 'geojson';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrafficSignService {
  private readonly http = inject(HttpClient);
  private readonly baseURL = environment.geoJson.trafficSignUrl;

  getTrafficSigns(municipalityId: string, rvvCode: string[]): Observable<TrafficSignFeatureCollection> {
    const url = `${this.baseURL}`;

    const headers = new HttpHeaders({
      accept: 'application/geo+json',
    });

    let params = new HttpParams()
      .append('town-code', municipalityId)
      .append('rvv-code', rvvCode.join(','))
      .append('status', 'PLACED');

    return this.http.get<FeatureCollection>(url, { headers, params });
  }
}

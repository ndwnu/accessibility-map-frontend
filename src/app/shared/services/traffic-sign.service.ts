import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { TrafficSign, TrafficSignFeatureCollection } from '@shared/models/traffic-sign.model';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrafficSignService {
  private readonly http = inject(HttpClient);
  private readonly baseURL = environment.ndw.trafficSignUrl;

  private readonly selectedTrafficSigns = new BehaviorSubject<TrafficSign[] | undefined>(undefined);
  selectedTrafficSigns$ = this.selectedTrafficSigns.asObservable();

  getTrafficSigns(municipalityId: string, rvvCode: string[]): Observable<TrafficSignFeatureCollection> {
    const url = `${this.baseURL}`;

    const headers = new HttpHeaders({
      accept: 'application/geo+json',
    });

    let params = new HttpParams()
      .append('town-code', municipalityId)
      .append('rvv-code', rvvCode.join(','))
      .append('status', 'PLACED');

    return this.http.get<TrafficSignFeatureCollection>(url, { headers, params }).pipe(
      map((featureCollection) => {
        featureCollection.features.forEach((feature) => {
          feature.properties.id = feature.id as string;
        });
        return featureCollection;
      }),
    );
  }

  setSelectedTrafficSigns(trafficSigns: TrafficSign[] | undefined) {
    this.selectedTrafficSigns.next(trafficSigns);
  }
}

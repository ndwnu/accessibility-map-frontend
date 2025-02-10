import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { RoadOperator } from '@shared/models';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoadOperatorService {
  private readonly _http = inject(HttpClient);
  private readonly baseURL = environment.ndw.accessibilityUrl;
  private cachedRoadOperators?: RoadOperator[];

  getRoadOperator(roadOperatorCode: string) {
    return this.cachedRoadOperators?.find((roadOperator) => roadOperator.roadOperatorCode === roadOperatorCode);
  }

  loadRoadOperators() {
    return this._http
      .get<RoadOperator[]>(`${this.baseURL}/road-operators`)
      .pipe(tap((roadOperators) => (this.cachedRoadOperators = roadOperators)));
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdokLookupResponse, PdokSuggestionResponse } from '@shared/models/pdok.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PdokService {
  private readonly _http = inject(HttpClient);
  baseUrl = environment.pdok.roadDataUrl;

  getSuggestions(term: string): Observable<PdokSuggestionResponse> {
    const params = { q: term };
    return this._http.get<PdokSuggestionResponse>(`${this.baseUrl}/suggest`, { params });
  }

  getPointData(id: string): Observable<PdokLookupResponse> {
    const params = { id };
    return this._http.get<PdokLookupResponse>(`${this.baseUrl}/lookup`, { params });
  }
}

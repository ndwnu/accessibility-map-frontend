import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdokLookupResponse, PdokSuggestionResponse } from '@shared/models/pdok.model';

@Injectable({
  providedIn: 'root',
})
export class PdokService {
  private readonly _http = inject(HttpClient);
  private readonly baseURL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1';

  getSuggestions(term: string): Observable<PdokSuggestionResponse> {
    const params = { q: term };
    return this._http.get<PdokSuggestionResponse>(`${this.baseURL}/suggest`, { params });
  }

  getPointData(id: string): Observable<PdokLookupResponse> {
    const params = { id };
    return this._http.get<PdokLookupResponse>(`${this.baseURL}/lookup`, { params });
  }
}

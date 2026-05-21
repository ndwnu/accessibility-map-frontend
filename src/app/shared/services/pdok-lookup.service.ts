import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { PdokLookup, PdokLookupResponse } from '@shared/models/pdok.model';
import { Position } from 'geojson';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PdokLookupService {
  #baseUrl = environment.pdok.roadDataUrl;

  selectedSuggestionId = signal<string | undefined>(undefined);

  readonly pdokLookupResponse = httpResource<PdokLookupResponse>(() => {
    const id = this.selectedSuggestionId();

    // Don't make the request if selection is undefined
    if (!id) {
      return undefined;
    }

    return {
      url: `${this.#baseUrl}/lookup`,
      params: { id },
    };
  });

  pdokLookup = computed(() => this.pdokLookupResponse.value()?.response.docs[0] ?? undefined);
  pdokLookup$: Observable<PdokLookup> = toObservable(this.pdokLookup).pipe(filter((lookup) => !!lookup));
  municipalityId = computed(() => (this.pdokLookup() ? `GM${this.pdokLookup()?.gemeentecode}` : undefined));
  centerPoint = computed(() => {
    const pdokLookup = this.pdokLookup();
    if (!pdokLookup) {
      return undefined;
    }

    const coordinate = pdokLookup.centroide_ll.substring(6).replace(')', '').split(' ');
    return [Number(coordinate[0]), Number(coordinate[1])] as Position;
  });
}

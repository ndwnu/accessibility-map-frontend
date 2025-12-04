import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { PdokLookupResponse } from '@shared/models/pdok.model';
import { Position } from 'geojson';

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

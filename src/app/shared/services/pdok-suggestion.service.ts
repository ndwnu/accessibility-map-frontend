import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { PdokSuggestionResponse } from '@shared/models/pdok.model';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdokSuggestionService {
  #baseUrl = environment.pdok.roadDataUrl;

  // Inputs
  enteredSearch = signal<string>('');
  selectedSuggestionId = signal<string | undefined>(undefined);

  #searchText$ = toObservable(this.enteredSearch).pipe(
    filter((text) => text.length > 2),
    debounceTime(300),
    distinctUntilChanged(),
  );
  #searchText = toSignal(this.#searchText$);

  readonly pdokSuggestionResponse = httpResource<PdokSuggestionResponse>(() => {
    const search = this.#searchText();

    // Don't make the request if search is undefined or empty
    if (!search) {
      return undefined;
    }

    return {
      url: `${this.#baseUrl}/suggest`,
      params: { q: search },
    };
  });

  pdokSuggestions = computed(() => this.pdokSuggestionResponse.value()?.response.docs ?? []);
}

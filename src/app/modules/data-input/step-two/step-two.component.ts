import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import {
  AutosuggestPanelComponent,
  AutosuggestDirective,
  AutosuggestOption,
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  FormFieldComponent,
  InputDirective,
  AlertComponent,
} from '@ndwnu/design-system';
import { FeedbackHeaderComponent } from '@shared/components/feedback-header';
import { StepTwoFormGroup } from '@shared/models';
import { PdokSuggestion } from '@shared/models/pdok.model';
import { ActionsComponent } from '../actions';
import { PdokSuggestionService } from '@shared/services/pdok-suggestion.service';
import { PdokLookupService } from '@shared/services/pdok-lookup.service';

@Component({
  selector: 'ber-step-two',
  imports: [
    ActionsComponent,
    AutosuggestPanelComponent,
    AutosuggestDirective,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    FeedbackHeaderComponent,
    FormFieldComponent,
    InputDirective,
    ReactiveFormsModule,
    AlertComponent,
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
})
export class StepTwoComponent implements OnInit {
  pdokSuggestionService = inject(PdokSuggestionService);
  pdokLookupService = inject(PdokLookupService);
  private dataInputService = inject(DataInputService);

  form = input.required<FormGroup<StepTwoFormGroup>>();
  autosuggestOptions = computed<AutosuggestOption[]>(() => {
    return this.pdokSuggestionService.pdokSuggestions().map((suggestion: PdokSuggestion) => ({
      label: suggestion.weergavenaam,
      value: suggestion.id,
    }));
  });
  noResultText = computed(() => {
    const response = this.pdokSuggestionService.pdokSuggestionResponse;
    const searchLength = this.pdokSuggestionService.enteredSearch().length;
    const suggestionsLength = this.pdokSuggestionService.pdokSuggestions().length;

    if (searchLength < 3) {
      return 'Voer minimaal 3 karakters in om te zoeken';
    }

    if (response.isLoading()) {
      return 'Gegevens worden geladen...';
    }

    if (response.error()) {
      return 'Er is een fout opgetreden bij het ophalen van zoekresultaten';
    }

    if (suggestionsLength === 0) {
      return 'Er kan geen gemeente of adres worden gevonden met die naam';
    }

    return '';
  });

  lookupIsLoading = computed(() => this.pdokLookupService.pdokLookupResponse.isLoading());
  lookupError = computed(() => this.pdokLookupService.pdokLookupResponse.error());

  next = output<void>();
  previous = output<void>();

  get municipalityId() {
    return this.dataInputService.municipalityIdControl;
  }

  ngOnInit() {
    if (environment.mock) {
      // const mockMunicipalityId = 'weg-91b90ecfed6d8e269987da70c7176803'; // Default: "Gemeente Amsterdam"
      // const mockRoadId = 'weg-91b90ecfed6d8e269987da70c7176803'; // Default: "Sint Jorisstraat, Amsterdam"
      const mockAddressId = 'adr-aa20cec20ce96eb1584903803c5936e2'; // Default: "Archimedeslaan 6, 3584BA Utrecht"
      this.pdokLookupService.selectedSuggestionId.set(mockAddressId);
    }

    this.form().markAsPristine();
  }

  addressSearchChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pdokSuggestionService.enteredSearch.set(input.value);
  }

  onOptionSelected(option: AutosuggestOption | null) {
    this.pdokLookupService.selectedSuggestionId.set(option ? (option.value as string) : undefined);
  }

  onNext() {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }
}

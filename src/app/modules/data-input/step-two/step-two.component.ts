import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CheckboxComponent,
  FormFieldComponent,
  IconComponent,
  InputDirective,
} from '@ndwnu/design-system';
import { FeedbackHeaderComponent } from '@shared/components/feedback-header';
import { StepTwoFormGroup } from '@shared/models';
import { PdokLookup, PdokSuggestion } from '@shared/models/pdok.model';
import { PdokService } from '@shared/services/pdok.service';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { ActionsComponent } from '../actions';
import { extractPdokLngLatValue } from '@shared/utils/geo-utils';

@Component({
  selector: 'ber-step-two',
  standalone: true,
  imports: [
    ActionsComponent,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CheckboxComponent,
    FeedbackHeaderComponent,
    FormFieldComponent,
    IconComponent,
    InputDirective,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
})
export class StepTwoComponent implements OnInit {
  form = input.required<FormGroup<StepTwoFormGroup>>();

  next = output<void>();
  previous = output<void>();

  loading = false;
  pdokSuggestions?: PdokSuggestion[];

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  private dataInputService = inject(DataInputService);
  private pdokService = inject(PdokService);

  get municipalityId() {
    return this.dataInputService.municipalityIdControl;
  }

  get address() {
    return this.dataInputService.addressControl;
  }

  get pdokId() {
    return this.dataInputService.pdokIdControl;
  }

  get pdokData() {
    return this.dataInputService.pdokDataControl;
  }

  get latitude() {
    return this.dataInputService.latitudeControl;
  }

  get longitude() {
    return this.dataInputService.longitudeControl;
  }

  ngOnInit() {
    if (environment.mock) {
      // const mockMunicipalityId = 'weg-91b90ecfed6d8e269987da70c7176803'; // Default: "Gemeente Amsterdam"
      // const mockRoadId = 'weg-91b90ecfed6d8e269987da70c7176803'; // Default: "Sint Jorisstraat, Amsterdam"
      const mockAddressId = 'adr-aa20cec20ce96eb1584903803c5936e2'; // Default: "Archimedeslaan 6, 3584BA Utrecht"
      this.selectPdokSuggestion(mockAddressId);
    }

    this.form().markAsPristine();
    this.address.valueChanges
      .pipe(
        tap((_term) => this.emptyStepTwo()),
        filter((term) => !!term && term.length > 2),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.loading = true;
          this.pdokSuggestions = undefined;
          return this.pdokService.getSuggestions(term!);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.loading = false;
        this.pdokSuggestions = res.response.docs;
        this.cdr.detectChanges();
      });
  }

  private emptyStepTwo() {
    this.municipalityId.setValue(null);
    this.pdokId.setValue(null);
    this.pdokData.setValue(null);
    this.latitude.setValue(null);
    this.longitude.setValue(null);
  }

  private updateFormValues(pdokData: PdokLookup) {
    this.pdokId.setValue(pdokData.id);
    this.pdokData.setValue(pdokData);
    this.municipalityId.setValue(`GM${pdokData.gemeentecode}`);
    this.address.setValue(pdokData.weergavenaam, { emitEvent: false });
    if (pdokData?.type !== 'gemeente') {
      const centerPoint = extractPdokLngLatValue(pdokData.centroide_ll);
      this.latitude.setValue(centerPoint[1]);
      this.longitude.setValue(centerPoint[0]);
    }
  }

  selectPdokSuggestion(pdokId: string) {
    this.loading = true;
    this.pdokSuggestions = undefined;
    this.pdokService
      .getPointData(pdokId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const firstResult = res.response.docs[0];
        this.updateFormValues(firstResult);
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  onNext() {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }
}

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

  ngOnInit() {
    if (environment.mock) {
      const mockMunicipalityId = 'gem-0b2a8b92856b27f86fbd67ab35808ebf'; // Default: "Gemeente Amsterdam"
      this.selectPdokSuggestion(mockMunicipalityId);
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
    this.updateFormValues(null);
  }

  private updateFormValues(pdokData: PdokLookup | null) {
    this.pdokId.setValue(pdokData?.id ?? '');
    this.pdokData.setValue(pdokData);
    this.municipalityId.setValue(pdokData ? `GM${pdokData.gemeentecode}` : '');
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
        this.address.setValue(firstResult.weergavenaam, { emitEvent: false });
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

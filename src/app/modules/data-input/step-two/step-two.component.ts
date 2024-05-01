import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CardComponent, FormFieldComponent, InputDirective } from '@ndwnu/design-system';
import { MunicipalityIdAndName, StepTwoFormGroup } from '@shared/models';
import { AccessibilityDataService } from '@shared/services';
import { map } from 'rxjs';

import { ActionsComponent } from '../actions';

@UntilDestroy()
@Component({
  selector: 'ber-step-two',
  standalone: true,
  imports: [ActionsComponent, CardComponent, FormFieldComponent, InputDirective, ReactiveFormsModule],
  providers: [AccessibilityDataService],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
})
export class StepTwoComponent implements OnInit {
  form = input.required<FormGroup<StepTwoFormGroup>>();

  next = output<void>();
  previous = output<void>();

  municipalities: MunicipalityIdAndName[] = [];

  private accessibilityDataService = inject(AccessibilityDataService);

  ngOnInit() {
    this.accessibilityDataService
      .getMunicipalities()
      .pipe(
        map((municipalities) =>
          municipalities.map(
            ({ id, properties }) =>
              ({
                id,
                name: properties.name,
              }) as MunicipalityIdAndName,
          ),
        ),
        untilDestroyed(this),
      )
      .subscribe((municipalities) => {
        this.municipalities = municipalities.sort((a, b) => a.name.localeCompare(b.name));
      });
  }

  onNext() {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }
}

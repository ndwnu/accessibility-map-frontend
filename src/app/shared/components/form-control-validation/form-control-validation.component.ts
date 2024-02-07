import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ber-form-control-validation',
  templateUrl: './form-control-validation.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlValidationComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  @Input() control!: FormControl | AbstractControl | null;
  get errorMessage(): string {
    if (!this.error) return '';
    const { name, data } = this.error;
    return this.getErrorMessage(name, data);
  }

  error: { name: string; data: any } | undefined = undefined;
  errorMessages: Record<string, string> = {
    required: 'Dit veld is verplicht',
    emailIsInvalid: 'E-mailadres is niet geldig',
    urlIsInvalid: 'Url is niet geldig',
    postalCodeIsInvalid: 'Postcode is niet geldig',
    emailsMismatch: 'E-mailadressen komen niet overeen',
    mustBeUnique: 'Dit veld is niet uniek',
    min: 'Dit veld mag niet kleiner zijn dan {data}',
    max: 'Dit veld mag niet groter zijn dan {data}',
  };

  ngAfterViewInit() {
    this.control?.statusChanges.pipe(untilDestroyed(this)).subscribe(() => {
      if (!this.control) return;

      this.error = undefined;

      const { errors } = this.control;
      if (errors !== null && this.control) {
        const [validationError] = Object.keys(errors);
        this.error = {
          name: validationError,
          data: errors[validationError],
        };
      }

      this.cdr.detectChanges();
    });
  }
  private getErrorMessage(errorName: string, data: { [key: string]: string }) {
    if (errorName === 'minlength') {
      return this.errorMessages[errorName].replace('{data}', data['requiredLength']);
    }
    if (errorName === 'min') {
      return this.errorMessages[errorName].replace('{data}', data['min']);
    }
    if (errorName === 'max') {
      return this.errorMessages[errorName].replace('{data}', data['max']);
    }
    if (errorName in this.errorMessages) {
      return this.errorMessages[errorName];
    }
    return data['customMessage'];
  }
}

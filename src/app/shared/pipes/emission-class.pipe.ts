import { Pipe, PipeTransform } from '@angular/core';
import { EmissionClass } from '@shared/models/emission-class.model';

@Pipe({
  name: 'emissionClass',
  standalone: true,
})
export class EmissionClassPipe implements PipeTransform {
  readonly #translations: Record<EmissionClass, string> = {
    [EmissionClass.Zero]: 'Euro 0',
    [EmissionClass.Euro1]: 'Euro 1',
    [EmissionClass.Euro2]: 'Euro 2',
    [EmissionClass.Euro3]: 'Euro 3',
    [EmissionClass.Euro4]: 'Euro 4',
    [EmissionClass.Euro5]: 'Euro 5',
    [EmissionClass.Euro6]: 'Euro 6',
  };

  transform(value?: string | EmissionClass | null): string {
    if (!value) {
      return 'Onbekend';
    }

    // Type guard to check if value is a valid EmissionClass
    const isValidEmissionClass = (val: string): val is EmissionClass =>
      Object.values(EmissionClass).includes(val as EmissionClass);

    if (isValidEmissionClass(value)) {
      return this.#translations[value];
    }

    return 'Onbekend';
  }
}

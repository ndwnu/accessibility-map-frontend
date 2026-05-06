import { Pipe, PipeTransform } from '@angular/core';
import { Condition } from '@shared/models/destination.model';

@Pipe({
  name: 'condition',
  standalone: true,
})
export class ConditionPipe implements PipeTransform {
  readonly #translations: Record<Condition, string> = {
    [Condition.Equals]: 'gelijk aan',
    [Condition.GreaterThanOrEquals]: 'groter dan of gelijk aan',
    [Condition.Unknown]: 'onbekend',
  };

  transform(value?: string | Condition | null): string {
    if (!value) {
      return 'Onbekend';
    }

    // Type guard to check if value is a valid Condition
    const isValidCondition = (val: string): val is Condition => Object.values(Condition).includes(val as Condition);

    if (isValidCondition(value)) {
      return this.#translations[value];
    }

    return 'Onbekend';
  }
}

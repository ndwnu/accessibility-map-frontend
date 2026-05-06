import { Pipe, PipeTransform } from '@angular/core';
import { UnitSymbol } from '@shared/models/destination.model';

@Pipe({
  name: 'unitSymbol',
  standalone: true,
})
export class UnitSymbolPipe implements PipeTransform {
  readonly #translations: Record<UnitSymbol, string> = {
    [UnitSymbol.Tons]: 'ton',
    [UnitSymbol.Metre]: 'meter',
    [UnitSymbol.Boolean]: 'waar/onwaar',
    [UnitSymbol.Enum]: 'opsomming',
    [UnitSymbol.Unknown]: 'onbekend',
  };

  transform(value?: string | UnitSymbol | null): string {
    if (!value) {
      return 'Onbekend';
    }

    // Type guard to check if value is a valid UnitSymbol
    const isValidUnitSymbol = (val: string): val is UnitSymbol => Object.values(UnitSymbol).includes(val as UnitSymbol);

    if (isValidUnitSymbol(value)) {
      return this.#translations[value];
    }

    return 'Onbekend';
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { FuelType } from '@shared/models/fuel-type.model';

@Pipe({
  name: 'fuelType',
  standalone: true,
})
export class FuelTypePipe implements PipeTransform {
  readonly #translations: Record<FuelType, string> = {
    [FuelType.CompressedNaturalGas]: 'CNG',
    [FuelType.Diesel]: 'Diesel',
    [FuelType.Electric]: 'Elektrisch',
    [FuelType.Ethanol]: 'Ethanol',
    [FuelType.Hydrogen]: 'Waterstof',
    [FuelType.LiquefiedNaturalGas]: 'LNG',
    [FuelType.LiquefiedPetroleumGas]: 'LPG',
    [FuelType.Petrol]: 'Benzine',
  };

  transform(value?: string | FuelType | null): string {
    if (!value) {
      return 'Onbekend';
    }

    // Type guard to check if value is a valid FuelType
    const isValidFuelType = (val: string): val is FuelType => Object.values(FuelType).includes(val as FuelType);

    if (isValidFuelType(value)) {
      return this.#translations[value];
    }

    return 'Onbekend';
  }
}

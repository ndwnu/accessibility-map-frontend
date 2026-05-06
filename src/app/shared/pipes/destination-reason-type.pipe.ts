import { Pipe, PipeTransform } from '@angular/core';
import { ReasonType } from '@shared/models/destination.model';

@Pipe({
  name: 'destinationReasonType',
  standalone: true,
})
export class DestinationReasonTypePipe implements PipeTransform {
  readonly #translations: Record<ReasonType, string> = {
    [ReasonType.VehicleLengthReason]: 'Voertuiglengte',
    [ReasonType.VehicleHeightReason]: 'Voertuighoogte',
    [ReasonType.VehicleWidthReason]: 'Voertuigbreedte',
    [ReasonType.VehicleAxleWeightReason]: 'Asgewicht',
    [ReasonType.VehicleWeightReason]: 'Voertuiggewicht',
    [ReasonType.FuelTypeReason]: 'Brandstoftype',
    [ReasonType.VehicleTypeReason]: 'Voertuigtype',
    [ReasonType.AccessibleReason]: 'Toegankelijkheid',
    [ReasonType.Unknown]: 'Onbekend',
  };

  transform(value?: string | ReasonType | null): string {
    if (!value) {
      return 'Onbekend';
    }

    // Type guard to check if value is a valid ReasonType
    const isValidReasonType = (val: string): val is ReasonType => Object.values(ReasonType).includes(val as ReasonType);

    if (isValidReasonType(value)) {
      return this.#translations[value];
    }

    return 'Onbekend';
  }
}

import { EmissionClass } from '@shared/models/emission-class.model';
import { FuelType } from '@shared/models/fuel-type.model';

export interface AccessibilityFilter {
  municipalityId: string;
  vehicleType: string;
  vehicleLength?: number;
  vehicleWidth?: number;
  vehicleHeight?: number;
  vehicleWeight?: number;
  vehicleAxleLoad?: number;
  vehicleHasTrailer: boolean;
  latitude?: number;
  longitude?: number;
  emissionClass?: EmissionClass;
  fuelTypes?: FuelType[];
}

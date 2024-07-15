import { NlsVehicleType, nlsVehicleMapping } from '@modules/map/models/nlsMappings';

export const VEHICLE_TYPES = {
  bus: 'Bus',
  car: 'Personenauto',
  light_commercial_vehicle: 'Bedrijfsauto (bestelbus)',
  motorcycle: 'Motor',
  tractor: 'Land- of bosbouwtrekker',
  truck: 'Bedrijfsauto (vrachtwagen)',
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

export function mapToNlsVehicleType(vehicleType: VehicleType): NlsVehicleType {
  if (!vehicleType) {
    throw new Error('Vehicle type is required');
  }
  const nlsVehicleType = nlsVehicleMapping[vehicleType];
  if (!nlsVehicleType) {
    throw new Error(`Unknown vehicle type: ${vehicleType}`);
  }
  return nlsVehicleType;
}

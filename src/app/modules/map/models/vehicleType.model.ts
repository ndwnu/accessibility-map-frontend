import { NlsVehicleType, nlsVehicleMapping } from '@modules/map/models/nlsMappings';

export const VEHICLE_TYPES = {
  bus: 'Bus',
  car: 'Personenauto',
  commercial_vehicle_truck: 'Bedrijfsauto (vrachtwagen)',
  commercial_vehicle_van: 'Bedrijfsauto (bestelbus)',
  motorcycle: 'Motor',
  tractor: 'Land- of bosbouwtrekker',
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

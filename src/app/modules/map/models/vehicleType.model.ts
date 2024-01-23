export const VEHICLE_TYPES = {
  car: 'Auto',
  commercial_vehicle: 'Bedrijfsauto',
  bus: 'Bus',
  motorcycle: 'Motor',
  tractor: 'Tractor',
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

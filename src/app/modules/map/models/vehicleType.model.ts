export const VEHICLE_TYPES = {
  bus: 'Bus',
  car: 'Personenauto',
  commercial_vehicle_truck: 'Bedrijfsauto (vrachtwagen)',
  commercial_vehicle_van: 'Bedrijfsauto (bestelbus)',
  motorcycle: 'Motor',
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

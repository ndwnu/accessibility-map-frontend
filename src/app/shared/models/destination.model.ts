export enum DestinationType {
  RoadSectionSegment = 'roadSectionSegment',
  Destination = 'destination',
  Unknown = 'unknown',
}

export interface DestinationProperties {
  type: DestinationType;
  roadSectionId: number;
  accessible: boolean;
  reasons: Reason[][];
}

export interface Reason {
  type: ReasonType;
  unitSymbol: UnitSymbol;
  condition: Condition;
  value?: number | string | boolean;
  values?: (number | string | boolean)[];
}

export enum ReasonType {
  VehicleLengthReason = 'vehicleLengthReason',
  VehicleHeightReason = 'vehicleHeightReason',
  VehicleWidthReason = 'vehicleWidthReason',
  VehicleAxleWeightReason = 'vehicleAxleWeightReason',
  VehicleWeightReason = 'vehicleWeightReason',
  FuelTypeReason = 'fuelTypeReason',
  VehicleTypeReason = 'vehicleTypeReason',
  AccessibleReason = 'accessibleReason',
  Unknown = 'unknown',
}

export enum UnitSymbol {
  Tons = 'tons',
  Metre = 'metre',
  Boolean = 'boolean',
  Enum = 'enum',
  Unknown = 'unknown',
}

export enum Condition {
  Equals = 'equals',
  GreaterThanOrEquals = 'greater_than_or_equals',
  Unknown = 'unknown',
}

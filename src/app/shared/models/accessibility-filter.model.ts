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
}

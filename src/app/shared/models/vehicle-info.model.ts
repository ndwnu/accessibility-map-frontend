import { VehicleType } from '@modules/map/models';

export interface VehicleInfo {
  type: VehicleType;
  length: number;
  width: number;
  height: number;
  weight: number;
  emptyWeight: number;
  maxWeight: number;
  maxAxleWeight: number;
}

import { VehicleType } from '@modules/map/models';

export enum VehicleHeight {
  bus = 2.9,
  car = 1.8,
  commercial_vehicle_truck = 3.5,
  commercial_vehicle_van = 2.8,
  motorcycle = 1.5,
  tractor = 2.9,
}

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

import { VehicleType } from '@modules/map/models';

export const exampleVehicleInfoList: VehicleInfo[] = [
  {
    type: 'bus',
    length: 12,
    width: 2.5,
    height: 3.5,
    weight: 12000,
    emptyWeight: 8000,
    maxWeight: 18000,
    maxAxleWeight: 9000,
  },
  {
    type: 'car',
    length: 4.5,
    width: 1.8,
    height: 1.8,
    weight: 2000,
    emptyWeight: 1500,
    maxWeight: 3000,
    maxAxleWeight: 1500,
  },
  {
    type: 'commercial_vehicle_truck',
    length: 10,
    width: 2.5,
    height: 3.5,
    weight: 15000,
    emptyWeight: 10000,
    maxWeight: 20000,
    maxAxleWeight: 10000,
  },
  {
    type: 'commercial_vehicle_van',
    length: 5,
    width: 2,
    height: 2.8,
    weight: 3500,
    emptyWeight: 2500,
    maxWeight: 5000,
    maxAxleWeight: 2500,
  },
  {
    type: 'motorcycle',
    length: 2.5,
    width: 1,
    height: 1.5,
    weight: 200,
    emptyWeight: 150,
    maxWeight: 300,
    maxAxleWeight: 150,
  },
];

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

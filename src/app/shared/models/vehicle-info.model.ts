import { NlsVehicleType } from '@modules/map/models/nlsMappings';
import { EmissionClass } from '@shared/models/emission-class.model';
import { FuelType } from '@shared/models/fuel-type.model';

export const exampleVehicleInfoList: VehicleInfo[] = [
  {
    type: NlsVehicleType.Bus,
    length: 12,
    width: 2.5,
    height: 3.5,
    weight: 12000,
    emptyWeight: 8000,
    maxWeight: 18000,
    maxAxleWeight: 9000,
    emissionClass: EmissionClass.Euro2,
    fuelTypes: [FuelType.Diesel],
  },
  {
    type: NlsVehicleType.Car,
    length: 4.5,
    width: 1.8,
    height: 1.8,
    weight: 2000,
    emptyWeight: 1500,
    maxWeight: 3000,
    maxAxleWeight: 1500,
    emissionClass: EmissionClass.Zero,
    fuelTypes: [FuelType.Electric],
  },
  {
    type: NlsVehicleType.LightCommercialVehicle,
    length: 5,
    width: 2,
    height: 2.8,
    weight: 3500,
    emptyWeight: 2500,
    maxWeight: 5000,
    maxAxleWeight: 2500,
    emissionClass: EmissionClass.Euro6,
    fuelTypes: [FuelType.Hydrogen],
  },
  {
    type: NlsVehicleType.Motorcycle,
    length: 2.5,
    width: 1,
    height: 1.5,
    weight: 200,
    emptyWeight: 150,
    maxWeight: 300,
    maxAxleWeight: 150,
    emissionClass: EmissionClass.Euro6,
    fuelTypes: [FuelType.Petrol],
  },
  {
    type: NlsVehicleType.Tractor,
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    emptyWeight: 0,
    maxWeight: 0,
    maxAxleWeight: 0,
    emissionClass: EmissionClass.Euro1,
    fuelTypes: [FuelType.Diesel],
  },
  {
    type: NlsVehicleType.Truck,
    length: 10,
    width: 2.5,
    height: 3.5,
    weight: 15000,
    emptyWeight: 10000,
    maxWeight: 20000,
    maxAxleWeight: 10000,
    emissionClass: EmissionClass.Euro5,
    fuelTypes: [FuelType.Diesel],
  },
];

export interface VehicleInfo {
  type: NlsVehicleType;
  length: number;
  width: number;
  height: number;
  weight: number;
  emptyWeight: number;
  maxWeight: number;
  maxAxleWeight: number;
  combinedMaxWeight?: number;
  trailerWeight?: number;
  emissionClass?: EmissionClass;
  fuelTypes?: FuelType[];
}

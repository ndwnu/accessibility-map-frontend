import { VehicleType } from '@modules/map/models';

export enum NlsVehicleType {
  Bus = 'bus',
  Car = 'car',
  LightCommercialVehicle = 'light_commercial_vehicle',
  Motorcycle = 'motorcycle',
  Tractor = 'tractor',
  Truck = 'truck',
}

export const nlsVehicleMapping: Partial<{ [key in VehicleType]: NlsVehicleType }> = {
  bus: NlsVehicleType.Bus,
  car: NlsVehicleType.Car,
  light_commercial_vehicle: NlsVehicleType.LightCommercialVehicle,
  motorcycle: NlsVehicleType.Motorcycle,
  truck: NlsVehicleType.Truck,
};

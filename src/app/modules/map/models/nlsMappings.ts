import { VehicleType } from '@modules/map/models';

export enum NlsVehicleType {
  Bus = 'bus',
  Car = 'car',
  CommercialVehicle = 'commercial_vehicle',
  Motorcycle = 'motorcycle',
}

export const nlsVehicleMapping: Partial<{ [key in VehicleType]: NlsVehicleType }> = {
  bus: NlsVehicleType.Bus,
  car: NlsVehicleType.Car,
  commercial_vehicle_truck: NlsVehicleType.CommercialVehicle,
  commercial_vehicle_van: NlsVehicleType.CommercialVehicle,
  motorcycle: NlsVehicleType.Motorcycle,
};

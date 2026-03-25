import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { combineLatest, map, Observable } from 'rxjs';
import { VehicleInfo } from '@shared/models/vehicle-info.model';
import { VEHICLE_TYPES, VehicleType } from '@modules/map/models';
import { RdwAxleResponse, RdwRegisteredVehiclesResponse } from '@shared/models';
import { RdwVehicleClassResponse } from '@shared/models/rdw-vehicle-class-response.model';
import { EmissionClass } from '@shared/models/emission-class.model';
import { FuelType } from '@shared/models/fuel-type.model';

@Injectable({
  providedIn: 'root',
})
export class RdwService {
  private readonly _http = inject(HttpClient);

  axleUrl = environment.rdw.axleUrl;
  plateCheckUrl = environment.rdw.plateCheckUrl;
  registeredVehiclesUrl = environment.rdw.registeredVehicleUrl;
  vehicleClassUrl = environment.rdw.vehicleClassUrl;

  getVehicleInfo(rawLicensePlate: string): Observable<VehicleInfo | null> {
    const licensePlate = this.toRdwLicensePlate(rawLicensePlate);
    const registeredVehicles = this.getRegisteredVehicles(licensePlate);
    const vehicleClasses = this.getVehicleClasses(licensePlate);
    const axleInformation = this.getAxleInformation(licensePlate);

    return combineLatest([registeredVehicles, vehicleClasses, axleInformation]).pipe(
      map(([vehicleInformation, vehicleClasses, axles]) => {
        if (vehicleInformation && vehicleInformation.length > 0) {
          const length = this.parseFloatPrivate(vehicleInformation[0].lengte);
          const width = this.parseFloatPrivate(vehicleInformation[0].breedte);
          const emptyWeight = this.parseFloatPrivate(vehicleInformation[0].massa_ledig_voertuig);
          const weight = this.parseFloatPrivate(vehicleInformation[0].massa_rijklaar);
          const maxWeight = this.parseFloatPrivate(vehicleInformation[0].toegestane_maximum_massa_voertuig);
          const combinedMaxWeight = this.parseFloatPrivate(vehicleInformation[0].maximum_massa_samenstelling);
          const trailerWeight = this.parseFloatPrivate(vehicleInformation[0].maximum_trekken_massa_geremd);

          return {
            type: this.mapVehicleType(vehicleInformation[0].voertuigsoort),
            length: length ? length / 100.0 : undefined,
            width: width ? width / 100.0 : undefined,
            height: 0.0,
            emptyWeight,
            weight,
            maxWeight,
            maxAxleWeight: this.getMaxAxleWeight(axles),
            combinedMaxWeight,
            trailerWeight,
            emissionClass: this.#getWorstEmissionClass(vehicleClasses),
            fuelTypes: this.#convertFuelTypes(vehicleClasses.map((vc) => vc.brandstof_omschrijving)),
          } as VehicleInfo;
        } else {
          return null;
        }
      }),
    );
  }

  private getMaxAxleWeight(axleResponse: RdwAxleResponse[]): number | undefined {
    return axleResponse.reduce((max, axle) => Math.max(parseFloat(axle.wettelijk_toegestane_maximum_aslast), max), 0);
  }

  private mapVehicleType(rdwVehicleType: string): VehicleType {
    if (rdwVehicleType === 'Bedrijfsauto') {
      return 'truck' as VehicleType;
    }

    const vehicleType = Object.keys(VEHICLE_TYPES).find((key) => VEHICLE_TYPES[key as VehicleType] === rdwVehicleType);
    return vehicleType as VehicleType;
  }

  private getRegisteredVehicles(licensePlate: string): Observable<RdwRegisteredVehiclesResponse[]> {
    return this._http.get<RdwRegisteredVehiclesResponse[]>(this.registeredVehiclesUrl + '?kenteken=' + licensePlate);
  }

  private getVehicleClasses(licensePlate: string): Observable<RdwVehicleClassResponse[]> {
    return this._http.get<RdwVehicleClassResponse[]>(this.vehicleClassUrl + '?kenteken=' + licensePlate);
  }

  private getAxleInformation(licensePlate: string): Observable<RdwAxleResponse[]> {
    return this._http.get<RdwAxleResponse[]>(this.axleUrl + '?kenteken=' + licensePlate);
  }

  private toRdwLicensePlate(licensePlate: string): string {
    return licensePlate.trim().replaceAll('-', '').toLocaleUpperCase();
  }

  private parseFloatPrivate(value: string): number | undefined {
    const number = parseFloat(value);
    return isNaN(number) ? undefined : number;
  }

  getPlateCheckUrl(plate: string) {
    return this.plateCheckUrl.replace('{plateNumber}', plate);
  }

  // Convert emissiecode_omschrijving to EmissionClass
  #convertEmissionClass(rdwEmissionClass: string): EmissionClass | undefined {
    switch (rdwEmissionClass) {
      case 'Z':
        return EmissionClass.Zero;
      case '0':
      case '1':
        return EmissionClass.Euro1;
      case '2':
        return EmissionClass.Euro2;
      case '3':
        return EmissionClass.Euro3;
      case '4':
        return EmissionClass.Euro4;
      case '5':
        return EmissionClass.Euro5;
      case '6':
        return EmissionClass.Euro6;
      default:
        return undefined;
    }
  }

  #getWorstEmissionClass(vehicleClasses: RdwVehicleClassResponse[]): EmissionClass | undefined {
    const emissionClasses = vehicleClasses
      .map((vc) => this.#convertEmissionClass(vc.emissiecode_omschrijving))
      .filter((ec) => ec !== undefined);

    if (emissionClasses.length === 0) {
      return undefined;
    }

    // Define emission class ranking (lower number = worse/older standard)
    const emissionRanking: Record<EmissionClass, number> = {
      [EmissionClass.Euro1]: 1,
      [EmissionClass.Euro2]: 2,
      [EmissionClass.Euro3]: 3,
      [EmissionClass.Euro4]: 4,
      [EmissionClass.Euro5]: 5,
      [EmissionClass.Euro6]: 6,
      [EmissionClass.Zero]: 7,
    };

    return emissionClasses.reduce((worst, current) => {
      return emissionRanking[current] < emissionRanking[worst] ? current : worst;
    });
  }

  #convertFuelTypes(rdwFuelTypes: string[]): FuelType[] {
    return rdwFuelTypes
      .map((fuelType) => {
        switch (fuelType) {
          case 'Benzine':
            return FuelType.Petrol;
          case 'Diesel':
            return FuelType.Diesel;
          case 'Elektriciteit':
            return FuelType.Electric;
          case 'Waterstof':
            return FuelType.Hydrogen;
          case 'LPG':
            return FuelType.LiquefiedPetroleumGas;
          case 'LNG':
            return FuelType.LiquefiedNaturalGas;
          case 'CNG':
            return FuelType.CompressedNaturalGas;
          case 'Alcohol':
            return FuelType.Ethanol;
          default:
            return undefined;
        }
      })
      .filter((ft) => ft !== undefined);
  }
}

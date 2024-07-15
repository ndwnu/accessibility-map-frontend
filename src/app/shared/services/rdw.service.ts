import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { combineLatest, map, Observable } from 'rxjs';
import { VehicleInfo } from '@shared/models/vehicle-info.model';
import { VEHICLE_TYPES, VehicleType } from '@modules/map/models';
import { RdwAxleResponse, RdwRegisteredVehiclesResponse } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class RdwService {
  private readonly _http = inject(HttpClient);

  axleUrl = environment.rdw.axleUrl;
  plateCheckUrl = environment.rdw.plateCheckUrl;
  registeredVehiclesUrl = environment.rdw.registeredVehicleUrl;

  getVehicleInfo(rawLicensePlate: string): Observable<VehicleInfo | null> {
    const licensePlate = this.toRdwLicensePlate(rawLicensePlate);
    const registeredVehicles = this.getRegisteredVehicles(licensePlate);
    const axleInformation = this.getAxleInformation(licensePlate);

    return combineLatest([registeredVehicles, axleInformation]).pipe(
      map(([vehicleInformation, axles]) => {
        if (vehicleInformation && vehicleInformation.length > 0) {
          const length = this.parseFloatPrivate(vehicleInformation[0].lengte);
          const width = this.parseFloatPrivate(vehicleInformation[0].breedte);
          const emptyWeight = this.parseFloatPrivate(vehicleInformation[0].massa_ledig_voertuig);
          const weight = this.parseFloatPrivate(vehicleInformation[0].massa_rijklaar);
          const maxWeight = this.parseFloatPrivate(vehicleInformation[0].toegestane_maximum_massa_voertuig);

          return {
            type: this.mapVehicleType(vehicleInformation[0].voertuigsoort),
            length: length ? length / 100.0 : undefined,
            width: width ? width / 100.0 : undefined,
            height: 0.0,
            emptyWeight,
            weight,
            maxWeight,
            maxAxleWeight: this.getMaxAxleWeight(axles),
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
}

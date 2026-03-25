import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RdwService } from './rdw.service';
import { EmissionClass } from '@shared/models/emission-class.model';
import { environment } from '@env/environment';

// Shared test fixtures
const MOCK_VEHICLE_DATA = {
  voertuigsoort: 'Bedrijfsauto',
  lengte: '500',
  breedte: '200',
  massa_ledig_voertuig: '1000',
  massa_rijklaar: '1200',
  toegestane_maximum_massa_voertuig: '3500',
  maximum_massa_samenstelling: '4000',
  maximum_trekken_massa_geremd: '750',
};

const MOCK_AXLE_DATA = [{ wettelijk_toegestane_maximum_aslast: '1000' }];

// Helper function to create emission class objects
function createEmissionClass(code: string, fuel = 'Diesel') {
  return { emissiecode_omschrijving: code, brandstof_omschrijving: fuel };
}

// Helper function to set up HTTP mocks for vehicle info
function setupVehicleMocks(
  httpMock: HttpTestingController,
  licensePlate: string,
  vehicleClasses: { emissiecode_omschrijving: string; brandstof_omschrijving: string }[],
) {
  const cleanedPlate = licensePlate.replace(/-/g, '').toUpperCase();

  // Mock registered vehicles
  const registeredVehiclesReq = httpMock.expectOne(`${environment.rdw.registeredVehicleUrl}?kenteken=${cleanedPlate}`);
  registeredVehiclesReq.flush([MOCK_VEHICLE_DATA]);

  // Mock vehicle classes (the important part for emission testing)
  const vehicleClassesReq = httpMock.expectOne(`${environment.rdw.vehicleClassUrl}?kenteken=${cleanedPlate}`);
  vehicleClassesReq.flush(vehicleClasses);

  // Mock axle data
  const axleReq = httpMock.expectOne(`${environment.rdw.axleUrl}?kenteken=${cleanedPlate}`);
  axleReq.flush(MOCK_AXLE_DATA);
}

describe('RdwService', () => {
  let service: RdwService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RdwService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RdwService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getVehicleInfo - worst emission class selection', () => {
    it('should return Euro1 when vehicle has both Euro1 and Euro6 emission classes', (done) => {
      const licensePlate = 'AB-123-CD';

      service.getVehicleInfo(licensePlate).subscribe((result) => {
        expect(result?.emissionClass).toBe(EmissionClass.Euro1);
        done();
      });

      setupVehicleMocks(httpMock, licensePlate, [createEmissionClass('6'), createEmissionClass('1')]);
    });

    it('should return Euro3 when vehicle has both Euro5 and Euro3 emission classes', (done) => {
      const licensePlate = 'XY-456-ZZ';

      service.getVehicleInfo(licensePlate).subscribe((result) => {
        expect(result?.emissionClass).toBe(EmissionClass.Euro3);
        done();
      });

      setupVehicleMocks(httpMock, licensePlate, [createEmissionClass('5'), createEmissionClass('3')]);
    });

    it('should return Euro6 when vehicle has both Euro6 and Zero emission classes', (done) => {
      const licensePlate = 'ZZ-999-AA';

      service.getVehicleInfo(licensePlate).subscribe((result) => {
        expect(result?.emissionClass).toBe(EmissionClass.Euro6);
        done();
      });

      setupVehicleMocks(httpMock, licensePlate, [createEmissionClass('6'), createEmissionClass('Z', 'Elektriciteit')]);
    });

    it('should return undefined when vehicle has no valid emission classes', (done) => {
      const licensePlate = 'XX-000-XX';

      service.getVehicleInfo(licensePlate).subscribe((result) => {
        expect(result?.emissionClass).toBeUndefined();
        done();
      });

      setupVehicleMocks(httpMock, licensePlate, [createEmissionClass('invalid'), createEmissionClass('unknown')]);
    });

    it('should filter out invalid emission classes and return the worst valid one', (done) => {
      const licensePlate = 'BB-222-CC';

      service.getVehicleInfo(licensePlate).subscribe((result) => {
        expect(result?.emissionClass).toBe(EmissionClass.Euro2);
        done();
      });

      setupVehicleMocks(httpMock, licensePlate, [
        createEmissionClass('invalid'),
        createEmissionClass('6'),
        createEmissionClass('2'),
      ]);
    });
  });
});

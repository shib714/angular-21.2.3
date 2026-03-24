import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { VehicleService } from './vehicle.service';
import { environment } from '../../../environments/env.dev';
import { vi } from 'vitest';
import { VehicleResponse } from './vehicle';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  const mockVehicles: VehicleResponse = {
    count: 2,
    next: '',
    previous: '',
    results: [
      {
        name: 'Sand Crawler',
        model: 'Digger Crawler',
        manufacturer: 'Corellia Mining Corporation',
        cost_in_credits: '150000',
        cargo_capacity: 50000,
        crew: 46,
        passengers: 30,
        vehicle_class: 'wheeled',
        films: ['https://swapi.dev/api/films/1/']
      },
      {
        name: 'TIE Fighter',
        model: 'Twin Ion Engine',
        manufacturer: 'Sienar Fleet Systems',
        cost_in_credits: 'unknown',
        cargo_capacity: 65,
        crew: 1,
        passengers: 0,
        vehicle_class: 'starfighter',
        films: []
      }
    ]
  };

  const mockFilm = { title: 'A New Hope' };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());

    TestBed.configureTestingModule({
      providers: [
        VehicleService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    // To prevent "Expected no open requests" errors due to toSignal(vehicles$) 
    // we must handle the initial request that happens upon service instantiation.
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(VehicleService);
  });

  afterEach(() => {
    httpMock.verify();
    vi.unstubAllGlobals();
  });

  it('should be created and load initial vehicles', () => {
    const req = httpMock.expectOne(environment.VEHICLE_URL);
    req.flush(mockVehicles);

    expect(service).toBeTruthy();
    expect(service.vehicles().length).toBe(2);
  });

  it('should set selected vehicle', () => {
    // Flush initial load
    httpMock.expectOne(environment.VEHICLE_URL).flush(mockVehicles);

    service.vehicleSelected('Sand Crawler');
    expect(service.selectedVehicle()?.name).toBe('Sand Crawler');
  });

  it('should load films for selected vehicle', async () => {
    // Flush initial load
    httpMock.expectOne(environment.VEHICLE_URL).flush(mockVehicles);

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFilm),
    } as Response);

    service.vehicleSelected('Sand Crawler');
    
    // Wait for the resource loader (Angular 21 resource uses microtasks)
    await new Promise(res => setTimeout(res, 100));

    expect(service.vehicleFilms()).toEqual([mockFilm]);
    expect(service.isLoadingFilms()).toBe(false);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/films/1/');
  });

  it('should handle error when loading vehicles', () => {
    const req = httpMock.expectOne(environment.VEHICLE_URL);
    req.error(new ErrorEvent('Network error'));

    expect(service.vehicles()).toEqual([]);
  });
});

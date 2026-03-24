import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleList } from './vehicle-list';
import { VehicleService } from '../vehicle.service';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { By } from '@angular/platform-browser';


describe('VehicleList', () => {
  let component: VehicleList;
  let fixture: ComponentFixture<VehicleList>;
  let mockVehicleService: any;
  let mockDialog: any;

  const mockVehicles = [
    { name: 'Sand Crawler' },
    { name: 'TIE Fighter' }
  ];

  beforeEach(async () => {
    mockVehicleService = {
      vehicles: signal(mockVehicles),
      selectedVehicle: signal(undefined),
      vehiclesError: signal(''),
      vehicleSelected: vi.fn()
    };

    mockDialog = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [VehicleList],
      providers: [
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the list of vehicles', () => {
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(2);
    expect(listItems[0].nativeElement.textContent).toContain('Sand Crawler');
    expect(listItems[1].nativeElement.textContent).toContain('TIE Fighter');
  });

  it('should call vehicleSelected and open dialog when a vehicle is clicked', () => {
    const listItem = fixture.debugElement.query(By.css('mat-list-item'));
    listItem.nativeElement.click();

    expect(mockVehicleService.vehicleSelected).toHaveBeenCalledWith('Sand Crawler');
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should highlight the selected vehicle', () => {
    mockVehicleService.selectedVehicle.set(mockVehicles[0]);
    fixture.detectChanges();

    const listItem = fixture.debugElement.query(By.css('mat-list-item'));
    expect(listItem.nativeElement.classList.contains('active')).toBe(true);
  });

  it('should display error message when it exists', () => {
    mockVehicleService.vehiclesError.set('Network Error');
    fixture.detectChanges();

    const errorDiv = fixture.debugElement.query(By.css('.alert-danger'));
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.nativeElement.textContent).toContain('Network Error');
  });
});

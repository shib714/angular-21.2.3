import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

import { VehicleService } from '../vehicle.service';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDetailDialog } from '../vehicle-detail/vehicle-detail-dialog';

@Component({
  selector: 'vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
  ],
  template: `
  <h1 class="page-title">{{pageTitle}}</h1>
  <mat-list>
      @for (vehicle of vehicles(); track vehicle.name) {
        <mat-list-item (click)="onSelected(vehicle.name)" 
            [class.active]="vehicle.name === selectedVehicle()?.name">
            {{vehicle.name}}
        </mat-list-item>
        <mat-divider></mat-divider>
      }

  </mat-list>
  @if (errorMessage()) {
    <div class="alert alert-danger">{{ errorMessage() }}</div>
  }
`,
  styles: `
    .active {
      background-color: rgba(0, 0, 0, 0.04);
      font-weight: bold;
    }
    .page-title {
      padding: 16px;
      margin: 0;
    }
    .alert-danger {
      color: #721c24;
      background-color: #f8d7da;
      border-color: #f5c6cb;
      padding: 12px;
      margin: 16px;
      border-radius: 4px;
    }
  `,
})
export class VehicleList {
  pageTitle = 'Swapi Vehicles';
  
  private vehicleService = inject(VehicleService);
  private dialog = inject(MatDialog);

  // Expose signals directly from service
  vehicles = this.vehicleService.vehicles;
  selectedVehicle = this.vehicleService.selectedVehicle;
  errorMessage = this.vehicleService.vehiclesError;

  // When a vehicle is selected, update the service state and show the detail dialog
  onSelected(vehicleName: string): void {
    this.vehicleService.vehicleSelected(vehicleName);
    this.showDialog();
  }

  showDialog(): void {
    this.dialog.open(VehicleDetailDialog, {
      width: '400px',
    });
  }
}

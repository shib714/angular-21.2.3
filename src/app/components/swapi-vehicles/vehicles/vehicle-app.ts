import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs'

import { MatBadgeModule } from '@angular/material/badge';

import { VehicleList } from './vehicle-list/vehicle-list';
import { CartShell } from '../cart/cart-shell/cart-shell';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'sw-app',
  standalone: true,
  imports: [CommonModule, MatTabsModule,  MatBadgeModule, CartShell, VehicleList],
  template: `
  <h2>{{pageTitle()}}</h2>
  <div class="responsive-grid">
      <div class="flex-row">
          <mat-tab-group animationDuration="0ms" mat-stretch-tabs="false" mat-align-tabs="start">
              <mat-tab label="Vehicle List">
                  <vehicle-list></vehicle-list>
              </mat-tab>
              <mat-tab>
                  <ng-template mat-tab-label>
                      <span matBadge="{{cartCount() > 0 ? cartCount() : '' }}" matBadgePosition="after"
                          matBadgeOverlap="false" matBadgeColor="primary">Cart</span>
                  </ng-template>
                  <cart-shell /> 
              </mat-tab>
          </mat-tab-group>
      </div>
  </div>
`,
  styles: ``,
})
export class VehiclesApp {
  pageTitle = signal<string>('Star Wars Vehicle for Sales');
  cartService = inject(CartService);
  cartCount = computed(() => this.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0));

}
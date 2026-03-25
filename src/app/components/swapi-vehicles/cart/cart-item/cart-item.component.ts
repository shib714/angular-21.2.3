import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../cart';
import { CartService } from '../cart.service';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'cart-item',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {

  cartService = inject(CartService);

  // Use modern signal-based input
  item = input.required<CartItem>();

  // Hard-coded quantity
  // These could instead come from an inventory system
  qtyArr = signal([1, 2, 3, 4, 5, 6, 7, 8]);

  // Sanitize the price into a number
  price = computed(() => {
    const cost = this.item().vehicle.cost_in_credits;
    const num = Number(cost);
    return isNaN(num) ? 0 : num;
  });

  // When the item changes, recalculate the extended price
  exPrice = computed(() => this.item().quantity * this.price());


  onSelectionChange(quantity: number): void {
    // Update the quantity in the item through the service
    this.cartService.updateInCart(this.item(), Number(quantity));
  }

  onRemove(): void {
    this.cartService.removeFromCart(this.item());
  }

  removeItem(): void {
    this.cartService.removeFromCart(this.item());
  }

  incrementItem(): void {
    this.cartService.updateInCart(this.item(), this.item().quantity + 1);
  }
  decrementItem(): void {
    this.cartService.updateInCart(this.item(), this.item().quantity - 1);
  }
}

import { Component, computed, inject } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { CartService } from '../cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cart-total',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, RouterLink],
  templateUrl: './cart-total.html',
  styleUrls: ['./cart-total.scss'],
})
export class CartTotal {

  cartService = inject(CartService);

  cartItems = this.cartService.cartItems;

  subTotal = this.cartService.subTotal;

  deliveryFee = this.cartService.deliveryFee;

  tax = this.cartService.tax;

  totalPrice = this.cartService.totalPrice;
  cartCount = computed(() => this.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0));


}
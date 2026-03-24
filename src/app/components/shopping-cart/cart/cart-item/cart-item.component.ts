import { Component, computed, inject, input, Input, signal } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { CartItem, CartService } from '../cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'cart-item',
  imports: [CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {

  cartService = inject(CartService);
  // Use a setter to emit whenever a new item is set  
  // _item!: CartItem;
  // get item(): CartItem {
  //   return this._item;
  // }
  // @Input() set item(item: CartItem) {
  //   this._item = item;
  //   this.cartItem.set(item);
  // }
  // Use modern signal-based input
  item = input.required<CartItem>();
  // Hard-coded quantity
  // These could instead come from an inventory system
  qtyArr = signal([1, 2, 3, 4, 5, 6, 7, 8]);

  // Cart item signal
  //cartItem = signal(this.item);

  // When the item changes, recalculate the extended price
  //exPrice = computed(() =>
  //  this.cartItem().quantity * Number(this.cartItem().product.price));
    // Sanitize the price into a number
 price = computed(() => {
    const cost = this.item().product.price;
    const num = Number(cost);
    return isNaN(num) ? 0 : num;
  });
  // When the item changes, recalculate the extended price
  exPrice = computed(() => this.item().quantity * this.price());


  // onSelectionChange(quantity: number): void {
  //   // Update the quantity in the item
  //   this.cartService.updateInCart(this.cartItem(), Number(quantity));
  // }

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
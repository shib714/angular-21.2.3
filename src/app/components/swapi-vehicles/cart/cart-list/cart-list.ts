import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CartService } from "../cart.service";
import { CartItemComponent } from "../cart-item/cart-item.component";
import { MatListModule } from "@angular/material/list";


@Component({
  selector: 'cart-list',
  standalone: true,
  template: `
    @for (item of cartItems(); track item.vehicle.name) {
      <cart-item [item]='item'></cart-item> 
    }
  `,
  imports: [CommonModule, CartItemComponent, MatListModule]
})
export class CartList {
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
}
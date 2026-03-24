import { Component } from '@angular/core';

import { CartList } from "../cart-list/cart-list";
import { CartTotal } from "../cart-total/cart-total";

@Component({
  selector: 'cart-shell',
  standalone: true,
  imports: [CartList, CartTotal],
  template: `
    <div class="content responsive-grid">
      <div>        
        <div class="flex-row">
            <cart-list ></cart-list>
            <cart-total></cart-total>
        </div>
    </div>
  `,
  styleUrls: ['./cart-shell.scss'],
  
})
export class CartShell {

}1
import { Component, EventEmitter, inject, Input, input, output, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { IProduct, Rating } from '../../product.service';
import { CartService } from '../../../cart/cart.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'product-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card>
      <mat-card-header>       
        <mat-card-title>{{ product().title }}</mat-card-title>
        <mat-card-subtitle>{{ product().category }}</mat-card-subtitle>
      </mat-card-header>
      <img mat-card-image src="{{ product().image }}" alt="{{ product().title }}" />
      <mat-card-content>
        <p>{{ product().description.substring(0, 100)}}...</p>
        <p class="price">{{ product().price | currency: 'CAD' }}</p>
        <p class="rating">
          <mat-icon>star</mat-icon>
          {{ product().rating.rate }}
          <mat-icon>thumb_up</mat-icon>
          {{ product().rating.count }}
        </p>       
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="addToCart(product())">Add to cart</button>
      </mat-card-actions>
    `,
  styleUrl: './product-card.scss',
})
export class ProductCard {
    
  product = input.required<IProduct>();
  //rating = input.required<Rating>();
  productAdded = output<IProduct>();
  cartService = inject(CartService);

  addToCart(product: IProduct) {
    this.productAdded.emit(product);
    this.cartService.addToCart(product);
  }
}
import { Injectable, computed, signal } from '@angular/core';
import { IProduct } from '../products/product.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    // Manage state with signals
    cartItems = signal<CartItem[]>([]);

    // Total up the extended price for each item
    //subTotal = computed(() => this.cartItems().reduce((total, item) => total + (item.product.quantity * Number(item.porduct.price), 0));
    subTotal = computed(() =>
        this.cartItems().reduce((total, item) => total + (item.quantity * Number(item.product.price)), 0));

    // Delivery is free if spending more than 100,000 credits
    deliveryFee = computed(() => this.subTotal() < 100 ? 10 : 0);

    cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
    savings = computed(() => this.cartCount() > 3 ? this.subTotal() * 0.05 : this.subTotal());
    discountedTotal = computed(() =>
        this.cartCount() > 3 ? this.subTotal() * 0.95 : this.subTotal()
    );
    // Tax could be based on shipping address zip code
    //tax = computed(() => Math.round(this.subTotal() * 13.00) / 100);
    tax = computed(() => +(this.subTotal() * 0.13).toFixed(2));

    // Total price
    totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

    // Add the product to the cart 
    // If the item is already in the cart, increase the quantity
    addToCart(product: IProduct): void {
        // Check if the product is already in the cart
        // Find the index of the product in the cart
        const index = this.cartItems().findIndex(item => item.product.id === product.id);
        // Not already in the cart, so add with default quantity of 1
        if (index === -1) {
            // Not already in the cart, so add with default quantity of 1
            this.cartItems.update(items => [...items, { product, quantity: 1 }]);
        } else {
            // Already in the cart, so increase the quantity by 1
            //   this.cartItems.update(items =>
            //     [
            //       ...items.slice(0, index),
            //       { ...items[index], quantity: items[index].quantity + 1 },
            //       ...items.slice(index + 1)
            //     ]);
            this.cartItems.update(items =>
                items.map((item, i) =>
                    i === index ? { ...item, quantity: item.quantity + 1 } : item
                )
            )
        }
    }
    // Remove the item from the cart
    removeFromCart(cartItem: CartItem): void {
        // Update the cart with a new array containing
        // all but the filtered out deleted item
        this.cartItems.update(items => items.filter(item =>
            item.product.id !== cartItem.product.id));
    }
    updateInCart(cartItem: CartItem, quantity: number) {
        // Update the cart with a new array containing
        // the updated item and all other original items
        this.cartItems.update(items =>
            items.map(item => item.product.id === cartItem.product.id ?
                { product: cartItem.product, quantity } : item));
    }
    clearCart() {
        this.cartItems.set([]);
    }


}

export interface Cart {
    cartItems: CartItem[]
}

export interface CartItem {
    product: IProduct;
    quantity: number;
}

// You could move this to a shared file
// and reuse it for every entity in the application
type ActionType = 'add' | 'update' | 'delete';

export interface Action<T> {
    item: T;
    action: ActionType;
}
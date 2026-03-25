/**
 *  In your Shopping Cart app, the most valuable integration is the connection between the Product List and the Cart Service.

  I will create a new integration test file src/app/components/shopping-cart/shopping-cart.integration.spec.ts that demonstrates two key flows:
   1. Add to Cart Flow: From ProductList -> ProductCard -> CartService.
   2. Cart Update Flow: From CartList -> CartItemComponent -> CartService.

   To run the test, use command : 
        ng test --include src/app/components/shopping-cart/shopping-cart.integration.spec.ts --ui --coverage
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductList } from './products/product-list/product-list';
import { CartList } from './cart/cart-list/cart-list';
import { CartService } from './cart/cart.service';
import { ProductService, IProduct } from './products/product.service';
import { environment } from '../../environments/env.dev';
import { By } from '@angular/platform-browser';

import { provideRouter } from '@angular/router';

describe('Shopping Cart Integration', () => {
    let cartService: CartService;
    let httpMock: HttpTestingController;

    const mockProducts: IProduct[] = [
        {
            id: 1,
            title: 'Real Product',
            price: 100,
            description: 'Desc',
            category: 'Cat',
            image: 'img.jpg',
            rating: { rate: 5, count: 1 },
            quantity: 1
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductList, CartList],
            providers: [
                CartService,
                ProductService,
                provideHttpClient(),
                provideHttpClientTesting(),
                //The CartList and CartSummary components use RouterLink (e.g., for the "Continue 
                //Shopping" button). In Angular, using RouterLink requires the Router service to be provided. Adding       
                //provideRouter([]) in the beforeEach block supplies this necessary dependency for the test environment.
                provideRouter([])
            ]
        }).compileComponents();

        cartService = TestBed.inject(CartService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('Add to Cart Flow (ProductList -> CartService)', () => {
        let fixture: ComponentFixture<ProductList>;

        it('should add a product to the real CartService when "Add to cart" is clicked', () => {
            fixture = TestBed.createComponent(ProductList);
            fixture.detectChanges();

            // Mock the HTTP call for products
            const req = httpMock.expectOne(environment.PRODUCTS_URL);
            req.flush(mockProducts);
            fixture.detectChanges();

            // 1. Verify Cart is empty initially
            expect(cartService.cartItems().length).toBe(0);

            // 2. Find the Add button in the first ProductCard and click it
            const addButton = fixture.debugElement.query(By.css('button')).nativeElement;
            addButton.click();

            // 3. VERIFY INTEGRATION: The CartService should now have the item
            expect(cartService.cartItems().length).toBe(1);
            expect(cartService.cartItems()[0].product.title).toBe('Real Product');
            expect(cartService.subTotal()).toBe(100);
        });
    });

    describe('Cart Management Flow (CartList -> CartService)', () => {
        let fixture: ComponentFixture<CartList>;

        it('should update totals in CartService when quantity is incremented in CartList', () => {
            // 1. Manually seed the service with an item
            cartService.addToCart(mockProducts[0]);

            fixture = TestBed.createComponent(CartList);
            fixture.detectChanges();

            // 2. Verify subtotal is 100
            expect(cartService.subTotal()).toBe(100);

            // 3. Find the increment button (+) in the CartItemComponent
            // (The second button in our component is 'add')
            const buttons = fixture.debugElement.queryAll(By.css('button'));
            const addButton = buttons.find(b => b.nativeElement.textContent.includes('add'));

            addButton?.nativeElement.click();
            fixture.detectChanges();

            // 4. VERIFY INTEGRATION: CartService state updated, affecting signals
            expect(cartService.cartItems()[0].quantity).toBe(2);
            expect(cartService.subTotal()).toBe(200);
        });

        it('should remove item from UI and Service when delete is clicked', () => {
            cartService.addToCart(mockProducts[0]);
            fixture = TestBed.createComponent(CartList);
            fixture.detectChanges();

            // Find the delete button (color="warn")
            const deleteBtn = fixture.debugElement.query(By.css('button[color="warn"]')).nativeElement;
            deleteBtn.click();
            fixture.detectChanges();

            // 5. VERIFY INTEGRATION: Service is empty and UI reflects it
            expect(cartService.cartItems().length).toBe(0);
            const emptyMsg = fixture.debugElement.query(By.css('p')).nativeElement;
            expect(emptyMsg.textContent).toContain('Your shopping cart is empty');
        });
    });
});
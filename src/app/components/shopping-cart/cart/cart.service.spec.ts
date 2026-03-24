import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { IProduct } from '../products/product.service';

describe('CartService', () => {
  let service: CartService;

  const productA: IProduct = {
    id: 1,
    title: 'A',
    price: 10,
    description: '',
    category: '',
    image: '',
    rating: { rate: 4, count: 10 },
    quantity: 1
  };

  const productB: IProduct = {
    id: 2,
    title: 'B',
    price: 20,
    description: '',
    category: '',
    image: '',
    rating: { rate: 5, count: 20 },
    quantity: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  // ---------------------------------------------------------
  // addToCart
  // ---------------------------------------------------------
  it('should add a new product to the cart', () => {
    service.addToCart(productA);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(1);
  });

  it('should increase quantity if product already exists', () => {
    service.addToCart(productA);
    service.addToCart(productA);

    expect(service.cartItems()[0].quantity).toBe(2);
  });

  // ---------------------------------------------------------
  // removeFromCart
  // ---------------------------------------------------------
  it('should remove an item from the cart', () => {
    service.addToCart(productA);
    service.addToCart(productB);

    service.removeFromCart({ product: productA, quantity: 1 });

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.id).toBe(2);
  });

  // ---------------------------------------------------------
  // updateInCart
  // ---------------------------------------------------------
  it('should update quantity of an item in the cart', () => {
    service.addToCart(productA);

    service.updateInCart({ product: productA, quantity: 1 }, 5);

    expect(service.cartItems()[0].quantity).toBe(5);
  });

  // ---------------------------------------------------------
  // computed: subTotal
  // ---------------------------------------------------------
  it('should compute subtotal correctly', () => {
    service.addToCart(productA); // 10
    service.addToCart(productB); // 20

    expect(service.subTotal()).toBe(30);
  });

  // ---------------------------------------------------------
  // computed: deliveryFee
  // ---------------------------------------------------------
  it('should charge delivery fee if subtotal < 100', () => {
    service.addToCart(productA);

    expect(service.deliveryFee()).toBe(10);
  });

  it('should give free delivery if subtotal >= 100', () => {
    service.addToCart({ ...productA, price: 100 });

    expect(service.deliveryFee()).toBe(0);
  });

  // ---------------------------------------------------------
  // computed: tax
  // ---------------------------------------------------------
  it('should compute tax correctly', () => {
    service.addToCart(productA); // 10

    expect(service.tax()).toBeCloseTo(1.3, 2);
  });

  // ---------------------------------------------------------
  // computed: totalPrice
  // ---------------------------------------------------------
  it('should compute total price correctly', () => {
    service.addToCart(productA); // 10

    const expected = 10 + 10 + 1.3; // subtotal + delivery + tax

    expect(service.totalPrice()).toBeCloseTo(expected, 2);
  });

  // ---------------------------------------------------------
  // computed: cartCount
  // ---------------------------------------------------------
  it('should compute cart count correctly', () => {
    service.addToCart(productA);
    service.addToCart(productA); // quantity = 2
    service.addToCart(productB); // quantity = 1

    expect(service.cartCount()).toBe(3);
  });

  // ---------------------------------------------------------
  // computed: savings
  // ---------------------------------------------------------
  it('should compute savings only when cartCount > 3', () => {
    service.addToCart(productA); // 1
    service.addToCart(productA); // 2
    service.addToCart(productA); // 3
    service.addToCart(productA); // 4

    const expectedSavings = service.subTotal() * 0.05;

    expect(service.savings()).toBeCloseTo(expectedSavings, 2);
  });
});

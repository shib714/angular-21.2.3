import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Vehicle } from '../vehicles/vehicle';
import { CartItem } from './cart';

describe('CartService', () => {
  let service: CartService;

  const mockVehicle: Vehicle = {
    name: 'Sand Crawler',
    model: 'Digger Crawler',
    manufacturer: 'Corellia Mining Corporation',
    cost_in_credits: '150000',
    cargo_capacity: 50000,
    crew: 46,
    passengers: 30,
    vehicle_class: 'wheeled',
    films: ['https://swapi.dev/api/films/1/']
  };

  const cheaperVehicle: Vehicle = {
    name: 'Snowspeeder',
    model: 't-47 airspeeder',
    manufacturer: 'Incom corporation',
    cost_in_credits: '500',
    cargo_capacity: 10,
    crew: 2,
    passengers: 0,
    vehicle_class: 'airspeeder',
    films: ['https://swapi.dev/api/films/2/']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty cart', () => {
    expect(service.cartItems()).toEqual([]);
    expect(service.subTotal()).toBe(0);
    expect(service.totalPrice()).toBe(999); // Free delivery at 10,000 credits, subTotal=0 < 10,000 so deliveryFee=999
  });

  it('should add a new vehicle to the cart', () => {
    service.addToCart(mockVehicle);
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0]).toEqual({ vehicle: mockVehicle, quantity: 1 });
  });

  it('should increase quantity if adding the same vehicle again', () => {
    service.addToCart(mockVehicle);
    service.addToCart(mockVehicle);
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
  });

  it('should remove an item from the cart', () => {
    service.addToCart(mockVehicle);
    const cartItem = service.cartItems()[0];
    service.removeFromCart(cartItem);
    expect(service.cartItems().length).toBe(0);
  });

  it('should update the quantity of an item in the cart', () => {
    service.addToCart(mockVehicle);
    const cartItem = service.cartItems()[0];
    service.updateInCart(cartItem, 5);
    expect(service.cartItems()[0].quantity).toBe(5);
  });

  it('should calculate subTotal correctly', () => {
    service.addToCart(mockVehicle); // 150000
    service.addToCart(cheaperVehicle); // 500
    // Total subTotal = 1 * 150000 + 1 * 500 = 150500
    expect(service.subTotal()).toBe(150500);
  });

  describe('Delivery Fee', () => {
    it('should charge 999 if subTotal is less than 10,000', () => {
      service.addToCart(cheaperVehicle); // 500
      expect(service.subTotal()).toBe(500);
      expect(service.deliveryFee()).toBe(999);
    });

    it('should be free (0) if subTotal is 10,000 or more', () => {
      service.addToCart(mockVehicle); // 150000
      expect(service.subTotal()).toBe(150000);
      expect(service.deliveryFee()).toBe(0);
    });
  });

  it('should calculate tax correctly (subTotal * 10.75 / 100)', () => {
    service.addToCart(mockVehicle); // 150000
    // 150000 * 10.75 = 1612500, then / 100 = 16125
    expect(service.tax()).toBe(16125);
  });

  it('should calculate totalPrice correctly (subTotal + delivery + tax)', () => {
    service.addToCart(mockVehicle);
    const sub = service.subTotal(); // 150000
    const dev = service.deliveryFee(); // 0
    const tax = service.tax(); // 16125
    expect(service.totalPrice()).toBe(sub + dev + tax);
  });
});

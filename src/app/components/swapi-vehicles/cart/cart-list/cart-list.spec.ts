import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

import { CartService } from '../cart.service';
import { CartList } from './cart-list';
import { CartItem } from '../cart';

describe('CartList', () => {
  let component: CartList;
  let fixture: ComponentFixture<CartList>;
  let mockCartService: any;

  const mockCartItems: CartItem[] = [
    {
      vehicle: {
        name: 'Sand Crawler',
        vehicle_class: 'wheeled',
        cost_in_credits: '150000',
        model: 'Digger Crawler',
        manufacturer: 'Corellia Mining Corporation',
        cargo_capacity: 50000,
        crew: 46,
        passengers: 30,
        films: []
      },
      quantity: 1
    },
    {
      vehicle: {
        name: 'TIE Fighter',
        vehicle_class: 'starfighter',
        cost_in_credits: 'unknown',
        model: 'Twin Ion Engine',
        manufacturer: 'Sienar Fleet Systems',
        cargo_capacity: 65,
        crew: 1,
        passengers: 0,
        films: []
      },
      quantity: 2
    },
  ];

  beforeEach(async () => {
    mockCartService = {
      cartItems: signal(mockCartItems),
    };

    await TestBed.configureTestingModule({
      imports: [CartList],
      providers: [
        { provide: CartService, useValue: mockCartService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a cart-item component for each item in the cart', () => {
    const cartItems = fixture.debugElement.queryAll(By.css('cart-item'));
    expect(cartItems.length).toBe(2);
  });

  it('should pass the correct item to each cart-item component', () => {
    const cartItemElements = fixture.debugElement.queryAll(By.css('cart-item'));
    
    // In Angular, we can check the component instance properties if it's a known component
    const firstItem = cartItemElements[0].componentInstance;
    const secondItem = cartItemElements[1].componentInstance;

    expect(firstItem.item()).toEqual(mockCartItems[0]);
    expect(secondItem.item()).toEqual(mockCartItems[1]);
  });

  it('should update the list when cart items change', () => {
    mockCartService.cartItems.set([mockCartItems[0]]);
    fixture.detectChanges();

    const cartItems = fixture.debugElement.queryAll(By.css('cart-item'));
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].componentInstance.item().vehicle.name).toBe('Sand Crawler');
  });

  it('should render nothing if the cart is empty', () => {
    mockCartService.cartItems.set([]);
    fixture.detectChanges();

    const cartItems = fixture.debugElement.queryAll(By.css('cart-item'));
    expect(cartItems.length).toBe(0);
  });
});

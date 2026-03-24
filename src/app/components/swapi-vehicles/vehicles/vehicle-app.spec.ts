import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VehiclesApp } from './vehicle-app';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart';
import { Vehicle } from './vehicle';
import { VehicleList } from './vehicle-list/vehicle-list';
import { CartShell } from '../cart/cart-shell/cart-shell';

@Component({
  selector: 'vehicle-list',
  standalone: true,
  template: ''
})
class MockVehicleList {}

@Component({
  selector: 'cart-shell',
  standalone: true,
  template: ''
})
class MockCartShell {}

describe('VehiclesApp', () => {
  let component: VehiclesApp;
  let fixture: ComponentFixture<VehiclesApp>;
  let mockCartService: Partial<CartService>;
  let cartItemsSignal = signal<CartItem[]>([]);

  beforeEach(async () => {
    mockCartService = {
      cartItems: cartItemsSignal
    };

    await TestBed.configureTestingModule({
      imports: [VehiclesApp, NoopAnimationsModule],
      providers: [
        { provide: CartService, useValue: mockCartService }
      ]
    })
    .overrideComponent(VehiclesApp, {
      remove: { imports: [VehicleList, CartShell] },
      add: { imports: [MockVehicleList, MockCartShell] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesApp);
    component = fixture.componentInstance;
    cartItemsSignal.set([]); // Reset for each test
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct page title', () => {
    expect(component.pageTitle()).toBe('Star Wars Vehicle for Sales');
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement.textContent).toContain('Star Wars Vehicle for Sales');
  });

  it('should calculate cartCount correctly when empty', () => {
    expect(component.cartCount()).toBe(0);
  });

  it('should calculate cartCount correctly with items', () => {
    const mockVehicle: Vehicle = { name: 'X-wing', model: 'T-65 X-wing', cost_in_credits: '149999' } as Vehicle;
    cartItemsSignal.set([
      { vehicle: mockVehicle, quantity: 2 },
      { vehicle: { ...mockVehicle, name: 'TIE Interceptor' }, quantity: 3 }
    ]);
    
    fixture.detectChanges();
    expect(component.cartCount()).toBe(5);
  });

  it('should update the badge with the correct count', () => {
    const mockVehicle: Vehicle = { name: 'X-wing' } as Vehicle;
    cartItemsSignal.set([{ vehicle: mockVehicle, quantity: 3 }]);
    
    fixture.detectChanges();
    
    const badgeElement = fixture.nativeElement.querySelector('.mat-badge-content');
    expect(badgeElement.textContent).toBe('3');
  });

  it('should not show a number in the badge when cart is empty', () => {
    cartItemsSignal.set([]);
    fixture.detectChanges();
    
    const badgeElement = fixture.nativeElement.querySelector('.mat-badge-content');
    // MatBadge might still render the element but with empty text or hidden
    // Based on the template: matBadge="{{cartCount() > 0 ? cartCount() : '' }}"
    // If empty, it's '', so we check if it's empty or doesn't exist.
    if (badgeElement) {
        expect(badgeElement.textContent.trim()).toBe('');
    }
  });
});

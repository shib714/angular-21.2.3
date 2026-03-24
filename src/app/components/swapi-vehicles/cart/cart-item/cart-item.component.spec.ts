import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItemComponent } from './cart-item.component';
import { CartService } from '../cart.service';

import { vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { CartItem } from '../cart';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;
  let mockCartService: any;

  const mockCartItem: CartItem = {
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
    quantity: 2
  };

  beforeEach(async () => {
    mockCartService = {
      updateInCart: vi.fn(),
      removeFromCart: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    // For signal inputs, use setInput on the componentRef
    fixture.componentRef.setInput('item', mockCartItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display item details correctly', () => {
    const title = fixture.debugElement.query(By.css('mat-card-title')).nativeElement;
    expect(title.textContent).toContain('Cart Item');

    const values = fixture.debugElement.queryAll(By.css('.value'));
    expect(values[0].nativeElement.textContent).toContain('Sand Crawler');
    expect(values[1].nativeElement.textContent).toContain('wheeled');
    expect(values[2].nativeElement.textContent).toContain('$150,000.00');
  });

  it('should calculate extended price correctly', () => {
    // 150000 * 2 = 300000
    expect(component.exPrice()).toBe(300000);
    const exPriceValue = fixture.debugElement.queryAll(By.css('.value'))[4].nativeElement;
    expect(exPriceValue.textContent).toContain('$300,000.00');
  });

  it('should call removeFromCart when delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    deleteButton.nativeElement.click();
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockCartItem);
  });

  it('should call updateInCart when quantity changes', () => {
    // Manually trigger the selection change
    component.onSelectionChange(5);
    expect(mockCartService.updateInCart).toHaveBeenCalledWith(mockCartItem, 5);
  });

  it('should update the item signal when input changes', () => {
    const newItem: CartItem = {
      ...mockCartItem,
      vehicle: { ...mockCartItem.vehicle, name: 'New Vehicle' }
    };
    fixture.componentRef.setInput('item', newItem);
    fixture.detectChanges();
    expect(component.item().vehicle.name).toBe('New Vehicle');
  });

  it('should handle "unknown" cost correctly by defaulting to 0', () => {
    const unknownItem: CartItem = {
      ...mockCartItem,
      vehicle: { ...mockCartItem.vehicle, cost_in_credits: 'unknown' }
    };
    fixture.componentRef.setInput('item', unknownItem);
    fixture.detectChanges();
    expect(component.price()).toBe(0);
    expect(component.exPrice()).toBe(0);
  });
});

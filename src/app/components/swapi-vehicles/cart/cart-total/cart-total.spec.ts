import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartTotal } from './cart-total';
import { CartService } from '../cart.service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';

describe('CartTotal', () => {
  let component: CartTotal;
  let fixture: ComponentFixture<CartTotal>;
  let mockCartService: any;

  beforeEach(async () => {
    mockCartService = {
      cartItems: signal([]),
      subTotal: signal(0),
      deliveryFee: signal(999),
      tax: signal(0),
      totalPrice: signal(999)
    };

    await TestBed.configureTestingModule({
      imports: [CartTotal],
      providers: [
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartTotal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "No items in cart" when cart is empty', () => {
    const noItemsPara = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(noItemsPara.textContent).toContain('No items in cart');
    expect(fixture.debugElement.query(By.css('mat-card'))).toBeFalsy();
  });

  it('should display summary when cart has items', () => {
    const mockItems = [{ vehicle: { name: 'Test' }, quantity: 2 }];
    mockCartService.cartItems.set(mockItems);
    mockCartService.subTotal.set(1000);
    mockCartService.deliveryFee.set(999);
    mockCartService.tax.set(107.5);
    mockCartService.totalPrice.set(2106.5);
    
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card).toBeTruthy();

    const subtitle = fixture.debugElement.queryAll(By.css('mat-card-subtitle'));
    expect(subtitle[0].nativeElement.textContent).toContain('Total Items: 1');
    expect(subtitle[1].nativeElement.textContent).toContain('Total Quantity: 2');

    const listValues = fixture.debugElement.queryAll(By.css('.summary-list .value'));
    expect(listValues[0].nativeElement.textContent).toContain('$1,000.00'); // Subtotal
    expect(listValues[1].nativeElement.textContent).toContain('$999.00');  // Delivery
    expect(listValues[2].nativeElement.textContent).toContain('$107.50');  // Tax

    const totalValue = fixture.debugElement.query(By.css('.summary-total dd'));
    expect(totalValue.nativeElement.textContent).toContain('$2,106.50'); // Total
  });

  it('should display "Free" when delivery fee is 0', () => {
    mockCartService.cartItems.set([{ vehicle: { name: 'Expensive' }, quantity: 1 }]);
    mockCartService.subTotal.set(20000);
    mockCartService.deliveryFee.set(0);
    
    fixture.detectChanges();

    const valueSpan = fixture.debugElement.queryAll(By.css('.summary-list .value'))[1];
    expect(valueSpan.nativeElement.textContent).toContain('Free');
    expect(valueSpan.nativeElement.style.color).toBe('red');
  });

  it('should calculate cartCount correctly using computed signal', () => {
    const mockItems = [
      { vehicle: { name: 'A' }, quantity: 2 },
      { vehicle: { name: 'B' }, quantity: 3 }
    ];
    mockCartService.cartItems.set(mockItems);
    
    // cartCount is a computed signal in the component based on service's cartItems
    expect(component.cartCount()).toBe(5);
  });
});

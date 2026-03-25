import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CartItemComponent } from "./cart-item.component";
import { CartItem, CartService } from "../cart.service";
import { By } from "@angular/platform-browser";


describe('CartItemComponent', () => {
    let component: CartItemComponent;
    let fixture: ComponentFixture<CartItemComponent>;
    let mockCartService: any;

    const mockCartItem: CartItem = {
        product: {
            id: 1,
            title: 'Test Product',
            price: 10,
            description: 'Test description',
            category: 'test',
            image: 'test.jpg',
            rating: { rate: 4, count: 10 },
            quantity: 1
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

    it('should calculate the correct price', () => {
        expect(component.price()).toBe(10);
    });

    it('should calculate the correct extended price', () => {
        // quantity (2) * price (10) = 20
        expect(component.exPrice()).toBe(20);
    });

    it('should handle non-numeric prices gracefully', () => {
        const invalidItem = {
            ...mockCartItem,
            product: { ...mockCartItem.product, price: 'invalid' as any }
        };
        fixture.componentRef.setInput('item', invalidItem);
        fixture.detectChanges();
        expect(component.price()).toBe(0);
        expect(component.exPrice()).toBe(0);
    });

    it('should call removeFromCart when removeItem is called', () => {
        component.removeItem();
        expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockCartItem);
    });

    it('should call updateInCart with incremented quantity when incrementItem is called', () => {
        component.incrementItem();
        expect(mockCartService.updateInCart).toHaveBeenCalledWith(mockCartItem, 3);
    });

    it('should call updateInCart with decremented quantity when decrementItem is called', () => {
        component.decrementItem();
        expect(mockCartService.updateInCart).toHaveBeenCalledWith(mockCartItem, 1);
    });

    it('should update computed values when input item changes', () => {
        const newItem = {
            ...mockCartItem,
            quantity: 5,
            product: { ...mockCartItem.product, price: 20 }
        };
        fixture.componentRef.setInput('item', newItem);
        fixture.detectChanges();

        expect(component.price()).toBe(20);
        expect(component.exPrice()).toBe(100);
    });

    it('should disable the decrement button if quantity is 1', () => {
        const itemWithQty1 = { ...mockCartItem, quantity: 1 };
        fixture.componentRef.setInput('item', itemWithQty1);
        fixture.detectChanges();

        const decrementBtn = fixture.debugElement.query(By.css('button:first-child')).nativeElement;
        expect(decrementBtn.disabled).toBe(true);
    });

    it('should enable the decrement button if quantity is greater than 1', () => {
        expect(component.item().quantity).toBe(2);
        const decrementBtn = fixture.debugElement.query(By.css('button:first-child')).nativeElement;
        expect(decrementBtn.disabled).toBe(false);
    });

    it('should call removeItem when delete button is clicked', () => {
        const deleteBtn = fixture.debugElement.query(By.css('button[color="warn"]'));
        deleteBtn.triggerEventHandler('click', null);
        expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockCartItem);
    });
});
                               
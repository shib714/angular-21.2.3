
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService, IProduct } from './product.service';
import { environment } from '../../../environments/env.dev';
import { vi } from 'vitest';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;
    const mockProducts: IProduct[] = [
        {
            id: 1,
            title: 'Product A',
            price: 10,
            description: 'Test',
            category: 'Cat',
            image: 'img',
            rating: { rate: 4, count: 10 },
            quantity: 1
        },
        {
            id: 2,
            title: 'Product B',
            price: 20,
            description: 'Test',
            category: 'Cat',
            image: 'img',
            rating: { rate: 5, count: 20 },
            quantity: 1
        }
    ];
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());

        TestBed.configureTestingModule({
            providers: [
                ProductService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        vi.unstubAllGlobals();
    });

    // ---------------------------------------------------------
    // 1. Should load products and add quantity = 1
    // ---------------------------------------------------------
    it('should load products and add quantity = 1', () => {
        let result: IProduct[] = [];

        service.products$.subscribe((data) => (result = data));
        const req = httpMock.expectOne(environment.PRODUCTS_URL);
        expect(req.request.method).toBe('GET');

        req.flush([
            {
                id: 1,
                title: 'Product A',
                price: 10,
                description: 'Test',
                category: 'Cat',
                image: 'img',
                rating: { rate: 4, count: 10 }
            }
        ]);
        expect(result.length).toBe(1);
        expect(result[0].quantity).toBe(1);
    });
    // ---------------------------------------------------------
    // 2. Should handle HTTP error and set loadingError signal
    // ---------------------------------------------------------
    it('should handle error and set loadingError signal', () => {
        let result: IProduct[] = [];

        service.products$.subscribe((data) => (result = data));

        const req = httpMock.expectOne(environment.PRODUCTS_URL);

        req.flush('Error loading', { status: 500, statusText: 'Server Error' });

        expect(result).toEqual([]);
        expect(service.loadingError()).toContain('Server returned code: 500');
    });

    // ---------------------------------------------------------
    // 3. products signal should reflect products$
    // ---------------------------------------------------------
    it('products signal should contain loaded products', () => {
        const req = httpMock.expectOne(environment.PRODUCTS_URL);
        req.flush(mockProducts);

        expect(service.products().length).toBe(2);
        expect(service.products()[0].quantity).toBe(1);
    });

    // ---------------------------------------------------------
    // 4. productSelected should update selectedProduct signal
    // ---------------------------------------------------------
    it('should set selectedProduct when productSelected is called', () => {
        const req = httpMock.expectOne(environment.PRODUCTS_URL);
        req.flush(mockProducts);
        service.productSelected(2);
        expect(service.selectedProduct()?.id).toBe(2);
    });
});

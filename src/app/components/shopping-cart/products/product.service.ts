import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/env.dev";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, of, shareReplay } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private url = environment.PRODUCTS_URL;
    private readonly http: HttpClient = inject(HttpClient);
    
    // Track product loading error
    loadingError = signal<string>('');

    //load products as observable
    products$ = this.http.get<ReadonlyArray<IProduct>>(this.url).pipe(
        map((data) =>
            //add quantity to the data returned by the API
            data.map((product) => ({ ...product, quantity: 1 })) as IProduct[]
        ),
        //transform the observable into a "hot" one that caches
        //the product list, optimizing performance by avoiding unnecessary network traffic
        // value 1 specifies a buffer size of one
        shareReplay(1),
        catchError((err) => {
            this.loadingError.set(this.getErrorMessage(err));
            return of([] as IProduct[]);
        })
    );

    //convert products$ to signal
    products = toSignal(this.products$, { initialValue: [] as IProduct[] });

    selectedProduct = signal<IProduct | undefined>(undefined);

    productSelected(productId: number){
        const foundProduct = this.products().find((p: IProduct) => p.id === productId);
        this.selectedProduct.set(foundProduct);
    }


    private handleError(err: HttpErrorResponse): void {
        console.error(this.getErrorMessage(err));
    }

    private getErrorMessage(err: HttpErrorResponse): string {
        if (err.error instanceof ErrorEvent) {
            return `An error occurred: ${err.error.message}`;
        } else {
            return `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
    }
}
export interface IProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: Rating;
    quantity: number;

}

export interface Rating {
    rate: number;
    count: number;
}
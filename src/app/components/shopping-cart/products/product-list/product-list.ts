import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ProductCard } from "./product-card/product-card";
import { CommonModule } from "@angular/common";
import { IProduct, ProductService } from "../product.service";


@Component({
    selector: 'product-list',
    imports: [CommonModule, ProductCard],
    template: `
    <!-- <h2 class="title"> {{pageTitle}}</h2>  -->
    <!-- <div class="product-list"> -->
        @for(p of products(); track p.id) {
            <product-card [product]="p" (productAdded)="addProductToCart($event)"></product-card>
        }
    <!-- </div> -->
    `,
    styleUrl: './product-list.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {

    pageTitle = 'Product List';

    private productService = inject(ProductService);

    products = this.productService.products;

    addProductToCart(product: IProduct) : void {
        console.log("product added to cart" , product)
    }

}

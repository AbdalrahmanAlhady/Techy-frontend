import { Component, effect, OnInit, untracked } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '../shared/models/Product';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  constructor(private productService: ProductService) {
    effect(() => {
      this.products = this.productService.productsSignal();
    });
  }
  ngOnInit(): void {
    this.productService
      .getProducts({ limit: this.productService.productsPerPage, page: 1 })
      .subscribe({
        next: (result) => {
          this.products = result.data.products || [];
          this.productService.productsSignal.set(this.products);
        },
        error: (error) => console.error('Error fetching products:', error),
      });
  }
}

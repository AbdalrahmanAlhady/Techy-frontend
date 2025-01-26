import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/Product';
import { CartService } from 'src/app/shared/services/cart.service';

import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  constructor(
    private productService: ProductService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private cartService: CartService
  ) {}
  viewProduct() {
    this.localStorageService.setItem('viewProduct', this.product);
    this.router.navigate(['product', this.product.id]);
  }
  addToCart() {
    this.cartService.addProductToCart(this.product, 1);
  }
}

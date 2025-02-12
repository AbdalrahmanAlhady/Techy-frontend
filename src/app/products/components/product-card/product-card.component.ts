import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../shared/models/Product';
import { ProductService } from '../../../shared/services/product.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  standalone: false,
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

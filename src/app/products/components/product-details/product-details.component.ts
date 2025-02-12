import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/Product';
import { ProductService } from '../../../shared/services/product.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  standalone: false,
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  quantity: number = 1;
  constructor(
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    if (!this.product) {
      this.product = this.localStorageService.getItem('viewProduct');
    }
  }
  addToCart() {
    this.cartService.addProductToCart(this.product, this.quantity);
  }
}

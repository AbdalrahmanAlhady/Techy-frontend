import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/Product';
import { CartService } from 'src/app/shared/services/cart.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
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

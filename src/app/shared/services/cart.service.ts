import { Injectable, signal } from '@angular/core';

import { Product } from '../models/Product';
import { LocalStorageService } from './local-storage.service';
import { OrderItem } from '../models/OrderItem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  updateCartLengthSignal = signal(0);
  constructor(private localStorageService: LocalStorageService) {}
  updateCartLength(length: number) {
    this.localStorageService.setItem('cartLength', length);
    this.updateCartLengthSignal.set(length);
  }
  addProductToCart(product: Product, quantity: number) {
    const cart: OrderItem[] = this.localStorageService.getItem('cart');
    if (cart) {
      const newCart: OrderItem[] = [
        ...cart,
        {
          unitPrice: product.price,
          quantity: quantity,
          totalPrice: product.price * quantity,
          product,
          productId: product.id,
        },
      ];
      this.localStorageService.setItem('cart', newCart);
      this.updateCartLength(newCart.length);
    } else {
      this.localStorageService.setItem('cart', [
        {
          unitPrice: product.price,
          quantity: quantity,
          totalPrice: product.price * quantity,
          product,
          productId: product.id,
        },
      ]);
      this.updateCartLength(1);
    }
  }
  emptyCart() {
    this.localStorageService.setItem('cart', []);
    this.updateCartLength(0);
  }
  removeProductFromCart(index: number): OrderItem[] {
    const cart: OrderItem[] = this.localStorageService.getItem('cart');
    if (cart) {
      const newCart: OrderItem[] = cart.filter((item, i) => i !== index);
      this.localStorageService.setItem('cart', newCart);
      this.updateCartLength(newCart.length);
      return newCart;
    }
    return cart;
  }
  editProductInCart(cartIndex: number, newQuantity: number): OrderItem[] {
    const existingCart: OrderItem[] = this.localStorageService.getItem('cart');
    if (existingCart) {
      existingCart[cartIndex].quantity = newQuantity;
      existingCart[cartIndex].totalPrice =
        existingCart[cartIndex].unitPrice * newQuantity;
      this.localStorageService.setItem('cart', existingCart);
    }
    return existingCart;
  }
}

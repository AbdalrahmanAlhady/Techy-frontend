import { Component, OnInit } from '@angular/core';

import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/Order';
import { OrderItem } from '../shared/models/OrderItem';
import { CartService } from '../shared/services/cart.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomvalidationService } from '../auth/services/customvalidation.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  orderItems: OrderItem[] = [];
  totalAmount: number = 0;
  deliveryFee: number = 5.0;
  deliveryOptions = [
    { label: 'Standard-Delivery- $5.00', value: 5.0 },
    { label: 'Express-Delivery- $10.00', value: 10.0 },
  ];
  error: string = '';
  address: string = '';
  addressForm = this.formBuilder.group({
    floor: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
      ]),
    ],
    buildingNumber: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
      ]),
    ],
    street: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
      ]),
    ],
    neighborhood: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
    ],
    city: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
    ],
    country: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
    ],
  });
  constructor(
    private cartService: CartService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService
  ) {}
  ngOnInit(): void {
    this.orderItems = this.localStorageService.getItem('cart');
    if (this.orderItems.length === 0) {
      this.router.navigate(['/']);
    }
  }
  calcTotal() {
    let total = 0;
    this.orderItems.forEach((item) => {
      total += item.unitPrice * item.quantity;
    });
    this.totalAmount = total + this.deliveryFee;
    return total;
  }

  removeProduct(index: number) {
    this.orderItems = this.cartService.removeProductFromCart(index);
    if (this.orderItems.length === 0) {
      this.router.navigate(['/']);
    }
  }
  changeQuantity(index: number, quantity: number) {
    this.orderItems = this.cartService.editProductInCart(index, quantity);
  }
  clearCart() {
    this.cartService.emptyCart();
    this.orderItems = [];
    this.addressForm.reset();
    this.router.navigate(['/']);
  }
  totalQuantity(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }
  createOrder() {
    if (this.addressForm.invalid) {
      this.error = 'Please fill all the fields';
      return;
    }
    this.address = `floor:${this.addressForm.value.floor},building:${this.addressForm.value.buildingNumber}, ${this.addressForm.value.street} st, ${this.addressForm.value.neighborhood}, ${this.addressForm.value.city}, ${this.addressForm.value.country}`;
    this.orderService
      .createOrder(
        this.orderItems.map(({ product, ...rest }) => rest),
        '2',
        this.totalAmount,
        this.deliveryFee,
        this.address
      )
      .subscribe((res) => {
        if (res.data?.createOrder) {
          this.clearCart();
          this.router.navigate(['/']);
        }
      });
  }
}

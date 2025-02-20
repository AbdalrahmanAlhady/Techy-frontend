import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/Order';
import { OrderItem } from '../shared/models/OrderItem';
import { CartService } from '../shared/services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomvalidationService } from '../auth/services/customvalidation.service';
import { PaymentService } from '../shared/services/payment.service';
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';
import { injectStripe, StripePaymentElementComponent } from 'ngx-stripe';
import { UserService } from '../shared/services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  standalone: false,
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
  addressForm: FormGroup;
  clientSecret!: string;
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  stripe = injectStripe(
    'pk_test_51MyM92EMsmnCvQBxWSv8x9VqUOJfnwOQQmJYXiCWPl6BZDUTINoU9s6PZUL0gmYs8ySzuJvVAfxs7msFBk5OXqCG00PkS3jGax'
  );
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'flat',
    },
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };
  paymentSuccess: boolean = false;
  @ViewChild('paymentModal') paymentModal!: TemplateRef<void>;
  modalRef?: BsModalRef;
  paying: boolean = false;
  paymentDone: boolean = false;
  constructor(
    private cartService: CartService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService,
    private paymentService: PaymentService,
    private userService: UserService,
    private modalService: BsModalService
  ) {
    this.addressForm = this.formBuilder.group({
      zipCode: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
        ]),
      ],
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
  }
  ngOnInit(): void {
    this.orderItems = this.localStorageService.getItem('cart');
    if (this.orderItems.length === 0) {
      this.router.navigate(['/']);
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(this.paymentModal);
      this.paymentDone = true;
    }, 1000);
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
  checkout() {
    if (this.addressForm.invalid) {
      this.error = 'Please fill all the fields';
      return;
    } else {
      this.error = '';
    }
    this.address = `floor:${this.addressForm.value.floor},building:${this.addressForm.value.buildingNumber}, ${this.addressForm.value.street} st, ${this.addressForm.value.neighborhood}, ${this.addressForm.value.city}, ${this.addressForm.value.country}`;
    this.paymentService
      .createPaymentIntent('usd', this.totalAmount)
      .subscribe((res) => {
        if (res.data?.createPaymentIntent) {
          this.clientSecret = res.data!.createPaymentIntent;
          this.elementsOptions.clientSecret = this.clientSecret;
          this.modalRef = this.modalService.show(this.paymentModal);
        }
      });
  }
  pay() {
    const user = this.userService.getCurrentUser();
    this.paying = true;
    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: user.firstName + ' ' + user.lastName,
              email: user.email,
              address: {
                line1: this.address as string,
                postal_code: this.addressForm.value.zipCode as string,
                city: this.addressForm.value.city as string,
              },
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe((result) => {
        console.log('Result', result);
        if (result.error) {
          this.paying = false;
          this.error = result.error.message!;
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            this.createOrder(result.paymentIntent.id);
          }
        }
      });
  }
  createOrder(stripePaymentId: string) {
    const orderItemsWithoutProduct = this.orderItems.map(
      ({ product, ...rest }) => rest
    );
    this.orderService
      .createOrder(
        stripePaymentId,
        orderItemsWithoutProduct,
        this.userService.getCurrentUser().id,
        this.totalAmount,
        this.deliveryFee,
        this.address
      )
      .subscribe({
        next: (res) => {
          setTimeout(() => {
            this.paying = false;
            this.paymentDone = true;
            setTimeout(() => {
              if (res.data?.createOrder) {
                this.modalRef?.hide();
                this.clearCart();
              }
            }, 3000);
          }, 3000);
        },
        error: (err) => {
          this.paying = false;
          console.log(err);
        },
      });
  }
  closePaymentModal() {
    this.modalRef?.hide();
  }
}

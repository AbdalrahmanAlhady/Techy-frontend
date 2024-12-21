import { Component, effect, inject, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  cartLength: number = 0;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private cartService: CartService
  ) {  
    effect(() => {
      this.cartLength = this.cartService.updateCartLengthSignal();
    })
  }
  ngOnInit(): void {
    this.cartLength = this.localStorageService.getItem('cartLength')
  }
  toCart() {
    if (this.localStorageService.getItem('cart').length == 0) {
      this._snackBar.open(
        'cart is empty, please add some products',
        'continue shopping',
        {
          duration: 2000,
          panelClass: ['red-snackbar'],
        }
      );
    } else {
      this.router.navigate(['cart']);
    }
  }
}

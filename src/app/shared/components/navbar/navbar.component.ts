import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/User';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ShareDataService } from '../../services/share-data.service';
import { UserService } from '../../services/user.service';

@Component({
  standalone: false,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('otpModal') otpModal!: TemplateRef<void>;
  @ViewChild('doneModal') doneModal!: TemplateRef<void>;
  subscriptions = new Subscription();
  private _snackBar = inject(MatSnackBar);
  cartLength: number = 0;
  user: User | null = null;
  modalRef?: BsModalRef;
  backendError: string = '';
  constructor(
    private localStorageService: LocalStorageService,
    public router: Router,
    private cartService: CartService,
    private modalService: BsModalService,
    private authService: AuthService,
    private shareDataService: ShareDataService,
    private userService: UserService
  ) {
    effect(() => {
      this.user =
        this.userService.userSignal() ||
        this.userService.getCurrentUser() ||
        null;
      if (this.cartService.updateCartLengthSignal() > 0)
        this.cartLength = this.cartService.updateCartLengthSignal();
    });
  }
  ngOnInit(): void {
    this.cartLength = this.localStorageService.getItem('cartLength') || 0;
    this.user = this.userService.getCurrentUser();
  }
  toCart() {
    if (!this.user) {
      this._snackBar.open('Please login first', 'Login', {
        duration: 2000,
        panelClass: ['snackbar'],
        verticalPosition: 'top',
      });
      this._snackBar._openedSnackBarRef?.onAction().subscribe(() => {
        this.router.navigate(['/signin']);
      });
    } else if (
      !this.localStorageService.getItem('cart') ||
      this.localStorageService.getItem('cart').length == 0
    ) {
      this._snackBar.open(
        'cart is empty, please add some products',
        'continue shopping',
        {
          duration: 2000,
          panelClass: ['snackbar'],
          verticalPosition: 'top',
        }
      );
    } else {
      this.router.navigate(['cart']);
    }
  }
  verifyEmail() {
    this.subscriptions.add(
      this.authService.sendOTP(this.user!.email, 'verify_email').subscribe({
        next: (res) => {
          if (res.data?.sendMail) {
            this.modalRef = this.modalService.show(this.otpModal);
          }
        },
        error: (err) => {
          this.backendError = err.message;
        },
      })
    );
  }
  logout() {
    this.authService.signout();
  }
}

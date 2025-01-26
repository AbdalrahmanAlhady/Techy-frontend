import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User, UserRole } from '../../../shared/models/User';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  backendError: string = '';
  userRoles = UserRole;
  signedup: boolean = false;
  signupForm:FormGroup = this.formBuilder.group({
    role: [UserRole.BUYER, Validators.required],
    firstName: [
      '',
      [Validators.required, Validators.maxLength(20), Validators.minLength(2)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.maxLength(20), Validators.minLength(2)],
    ],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern('.*com$'),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
    ],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        this.customValidator.passwordValidator(),
      ]),
    ],
    cPassword: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        this.customValidator.passwordValidator(),
      ]),
    ],
  },{validators: this.customValidator.mustMatch('password', 'cPassword')});
  subscriptions = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {}
  switchToSignin() {
    this.router.navigate(['/signin']);
  }
  signup(formData: User & { password: string; cPassword: string }) {
    this.subscriptions.add(
      this.authService.signup(formData).subscribe({
        next: (res) => {
          if (res.data?.register) {
            this.signedup = true;
            setTimeout(() => {
              this.signedup = false;
              this.router.navigate(['/signin']);
            }, 4000);
          }
        },
        error: (error) => {
          console.log(error.message);
          this.backendError = error.message;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

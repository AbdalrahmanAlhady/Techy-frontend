import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomvalidationService } from '../../../auth/services/customvalidation.service';
import { AuthService } from '../../services/auth.service';
import { ShareDataService } from '../../services/share-data.service';

@Component({
  standalone: false,
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  @Input() email: string = '';
  @Input() forgetPasswordMode: boolean = false;
  otp: string = '';
  backendError: string = '';
  verified: boolean = false;
  subscriptions = new Subscription();
  forgetPasswordForm!: FormGroup;
  constructor(
    private userService: UserService,
    private shareDataService: ShareDataService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService
  ) {
    this.forgetPasswordForm = this.formBuilder.group(
      {
        newPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            this.customValidator.passwordValidator(),
          ]),
        ],
        cNewPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            this.customValidator.passwordValidator(),
          ]),
        ],
      },
      {
        validator: this.customValidator.mustMatch(
          'newPassword',
          'cNewPassword'
        ),
      }
    );
  }
  ngOnInit(): void {}

  verifyOtp() {
    this.subscriptions.add(
      this.authService.verifyEmailViaOTP(this.otp, this.email).subscribe({
        next: (res) => {
          if (res.data?.verifyEmail) {
            this.verified = true;
            setTimeout(() => {
              this.shareDataService.$informationUpdated.next(true);
            }, 2000);
          }
        },
        error: (error) => {
          this.backendError = error.message;
        },
      })
    );
  }
  forgetPassword() {
    this.forgetPasswordMode = true;
    let updateInfo = {
      newPassword: this.forgetPasswordForm.value.newPassword,
      cNewPassword: this.forgetPasswordForm.value.cNewPassword,
    };
    this.subscriptions.add(
      this.authService
        .changeOrForgetPassword(
          this.email!,
          updateInfo.newPassword!,
          updateInfo.cNewPassword!,
          undefined,
          this.otp
        )
        .subscribe({
          next: (res) => {
            if (res.data?.resetPassword) {
              this.shareDataService.$informationUpdated.next(true);
            } else {
              this.backendError = 'error';
            }
          },
          error: (error) => {
            this.backendError = error.message;
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

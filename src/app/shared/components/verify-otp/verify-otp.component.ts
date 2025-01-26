import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription, timeout } from 'rxjs';
import { ShareDataService } from 'src/app/shared/services/share-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomvalidationService } from 'src/app/auth/services/customvalidation.service';

@Component({
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
  forgetPasswordForm = this.formBuilder.group(
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
    { validator: this.customValidator.mustMatch('newPassword', 'cNewPassword') }
  );
  constructor(
    private userService: UserService,
    private shareDataService: ShareDataService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService
  ) {}
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

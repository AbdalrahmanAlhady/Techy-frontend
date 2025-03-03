import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ShareDataService } from '../../../shared/services/share-data.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  @ViewChild('otpModal') otpModal!: TemplateRef<void>;
  @ViewChild('doneModal') doneModal!: TemplateRef<void>;
  backendError: string = '';
  modalRef?: BsModalRef;
  forgetPasswordMode: boolean = false;
  forgetPasswordEmail: string = '';
  subscriptions = new Subscription();
  signinForm!: FormGroup;
  sendOtpForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private modalService: BsModalService,
    private shareDataService: ShareDataService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.signinForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('.*com$'),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
      password: ['', Validators.compose([Validators.required])],
    });
    this.sendOtpForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('.*com$'),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('mode') === 'fp') {
        this.forgetPasswordMode = true
        
      }
      
    });
  }

  signin(formData: { email: string; password: string }) {
    this.subscriptions.add(
      this.authService.signin(formData.email, formData.password).subscribe({
        next: (res) => {
          if (res.data?.login.accessToken && res.data?.login.refreshToken) {
            this.authService.setAccessToken(res.data?.login.accessToken);
            this.authService.setRefreshToken(res.data?.login.refreshToken);
            this.userService.setCurrentUser(res.data?.login.user);
            this.authService.signedIn = true;
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.backendError = error.message;
        },
      })
    );
  }

  sendForgetPasswordEmail() {
    this.subscriptions.add(
      this.authService
        .sendOTP(this.sendOtpForm.value.email!, 'verify_email')
        .subscribe({
          next: (res) => {
            if (res.data?.sendMail) {
              this.modalRef = this.modalService.show(this.otpModal);
              this.subscriptions.add(
                this.shareDataService.$informationUpdated.subscribe((res) => {
                  if (res) {
                    this.modalRef?.hide();
                    this.modalService.show(this.doneModal);
                    setTimeout(() => {
                      this.shareDataService.$informationUpdated.next(false);
                      window.location.reload();
                    }, 2000);
                  }
                })
              );
            }
          },
          error: (err) => {
            this.backendError = err.message;
          },
        })
    );
  }
  reload() {
    window.location.reload();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRole } from '../shared/models/User';
import { CustomvalidationService } from '../auth/services/customvalidation.service';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  standalone: false,
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css',
})
export class PersonalInfoComponent implements OnInit {
  @ViewChild('doneModal') doneModal!: TemplateRef<void>;
  modalRef?: BsModalRef;
  user!: User;
  infoForm!: FormGroup;
  passwordForm!: FormGroup;
  backendError: string = '';
  formHasChanged: boolean = false;
  passwordUpdated: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: BsModalService
  ) {
    this.infoForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.maxLength(20),
            Validators.minLength(2),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.maxLength(20),
            Validators.minLength(2),
          ],
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
       
      }

    );
    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
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
        validators: this.customValidator.mustMatch(
          'newPassword',
          'cNewPassword'
        ),
      }
    );
  }
  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.infoForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
    });
    this.listenInfoChanged();
  }
  listenInfoChanged(): void {
    this.infoForm.valueChanges.subscribe(() => {
      if (
        this.infoForm.value.firstName === this.user.firstName &&
        this.infoForm.value.lastName === this.user.lastName &&
        this.infoForm.value.email === this.user.email
      ) {
        this.formHasChanged = false;
      } else {
        this.formHasChanged = true;
      }
      console.log(this.formHasChanged, this.infoForm);
    });
  }
  updateInfo() {
    this.userService
      .updateUser(
        this.user.id + '',
        this.user.role,
        this.infoForm.value.email,
        this.infoForm.value.lastName,
        this.infoForm.value.firstName,
        this.user.verified,
        null
      )
      .subscribe({
        next: (res) => {
          if (res.data?.updateUser) {
            this.modalRef = this.modalService.show(this.doneModal);
            this.userService.setCurrentUser(res.data.updateUser);
            this.formHasChanged = false;
            setTimeout(() => {
              this.modalRef?.hide();
            },  2500);
          } else {
            this.backendError = 'error';
          }
        },
        error: (error) => {
          this.backendError = error.message;
        },
      });
  }
  updatePassword() {
    this.authService
      .changeOrForgetPassword(
        this.user.email,
        this.passwordForm.value.newPassword,
        this.passwordForm.value.cNewPassword,
        this.passwordForm.value.currentPassword
      )
      .subscribe({
        next: (res) => {
          if (res.data?.resetPassword) {
            this.modalRef = this.modalService.show(this.doneModal);
            this.passwordForm.reset();
            this.passwordUpdated = true;
            setTimeout(() => {
              this.modalRef?.hide();
            }, 2500);
          } else {
            this.backendError = 'error';
          }
        },
        error: (error) => {
          this.backendError = error.message;
        },
      });
  }
}

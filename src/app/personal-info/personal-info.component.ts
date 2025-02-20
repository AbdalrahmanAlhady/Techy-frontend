import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRole } from '../shared/models/User';
import { CustomvalidationService } from '../auth/services/customvalidation.service';
import { UserService } from '../shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css',
})
export class PersonalInfoComponent implements OnInit {
  user!: User;
  infoForm!: FormGroup;
  backendError: string = '';
  formHasChanged: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public customValidator: CustomvalidationService,
    private userService: UserService
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
        // password: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     Validators.minLength(10),
        //     this.customValidator.passwordValidator(),
        //   ]),
        // ],
        // cPassword: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     Validators.minLength(10),
        //     this.customValidator.passwordValidator(),
        //   ]),
        // ],
      }
      // { validators: this.customValidator.mustMatch('password', 'cPassword') }
    );
  }
  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.infoForm.patchValue(this.user);
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
      }else{
        this.formHasChanged = true;
      }
    });
  }
  update() {}
}

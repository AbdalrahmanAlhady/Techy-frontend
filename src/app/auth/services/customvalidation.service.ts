import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class CustomvalidationService {
  passwordValidator(userControl?: AbstractControl) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]+/.test(value);

      const hasLowerCase = /[a-z]+/.test(value);

      const hasNumeric = /[0-9]+/.test(value);
      const hasSymbol = /[!@#%^&*()_+=/\|]+/.test(control.value);
      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSymbol;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }
  numeric(control: AbstractControl) {
    const val = control.value;

    if (val === null || val === '') return null;

    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/))
      return { invalidNumber: true };

    return null;
  }
    mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
  
      if (!control || !matchingControl) {
        console.error(`Form controls not found: ${controlName}, ${matchingControlName}`);
        return null;
      }
  
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return null;
      }
  
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
  
      return null;
    };
  }
  public getErrorMessage(controlName: string, form: FormGroup) {
    const control = form.controls[controlName];
    console.log(controlName,control);
    if (control.errors) {
      if (control.errors['required']) {
        return `${this.getFieldName(controlName)} is required.`;
      } else if (control.errors['minlength']) {
        return `${this.getFieldName(controlName)} should be minimum ${
          control.errors['minlength'].requiredLength
        } characters.`;
      } else if (control.errors['maxlength']) {
        return `${this.getFieldName(controlName)} should be maximum ${
          control.errors['maxlength'].requiredLength
        } characters.`;
      } else if (control.errors['pattern']) {
        if (controlName === 'email') {
          return 'Enter in the format:name@example.com';
        }
        return `Please enter a valid ${this.getFieldName(controlName)}.`;
      } else if (control.errors['passwordStrength']) {
        return `Password must have atleast 1 lower case, 1 upper case and 1 numeric characters and 1 symbol.`;
      } else if (control.errors['mustMatch']) {
        return 'Confirm password must match password';
      }
    }
    return '';
  }

  public getFieldName(controlName: string): string {
    switch (controlName) {
      case 'firstName':
        return 'First Name';
      case 'lastName':
        return 'Last Name';
      case 'cPassword' || 'password':
        return 'Password';
      case 'email':
        return 'Email';
      default:
        return controlName;
    }
  }
  constructor() {}
}

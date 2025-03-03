import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  @Input() form!: FormGroup;
  @Input() controlName: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() customValidator: any;
  @Input() icon: string = 'edit';
  @Input() width!: number;
  @Input() outsideError: boolean = false;
  @Input() textArea: boolean = false;
}

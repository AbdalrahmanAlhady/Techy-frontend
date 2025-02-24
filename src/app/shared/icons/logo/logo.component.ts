import { Component } from '@angular/core';
import { IconsBaseComponent } from '../icons-base/icons-base.component';

@Component({
  standalone: false,
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
})
export class LogoComponent extends IconsBaseComponent {
  constructor() {
    super();
  }
}

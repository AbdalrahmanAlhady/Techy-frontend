import { Component } from '@angular/core';
import { IconsBaseComponent } from '../icons-base/icons-base.component';

@Component({
  standalone: false,
  selector: 'app-email-verified-svg',
  templateUrl: './email-verified-svg.component.html',
  styleUrls: ['./email-verified-svg.component.css'],
})
export class EmailVerifiedSvgComponent extends IconsBaseComponent {
  constructor() {
    super();
  }
}

import { Component } from '@angular/core';
import { IconsBaseComponent } from '../icons-base/icons-base.component';

@Component({
  standalone:false,
  selector: 'app-upload-svg',
  templateUrl: './upload-svg.component.html',
  styleUrl: './upload-svg.component.css'
})
export class UploadSvgComponent extends IconsBaseComponent{
  constructor() { super(); }
}

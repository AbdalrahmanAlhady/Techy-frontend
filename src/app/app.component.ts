import { Component } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Techy-frontend';

  ngOnInit() {
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'Tech-2024',
      },
    });
  }
}

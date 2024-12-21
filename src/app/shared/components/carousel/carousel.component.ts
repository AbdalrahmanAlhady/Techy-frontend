import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '../../models/Product';
import { timeout } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit{
  @Input() products: Product[] = [];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 200,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
    items: 4,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
  };
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.products = this.productService.productsSignal();

  }
}

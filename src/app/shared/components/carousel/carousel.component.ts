import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: false,
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
  @Input() products: Product[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products = this.productService.productsSignal();
  }
}

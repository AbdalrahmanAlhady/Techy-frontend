import { Component, effect, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  standalone:false,
  selector: 'app-product-pagination',
  templateUrl: './product-pagination.component.html',
  styleUrls: ['./product-pagination.component.css'],
})
export class ProductPaginationComponent implements OnInit {
  pagesNumber: number = 0;
  pages: number[] = [];
  constructor(private productService: ProductService) {
    effect(() => {
      if (this.productService.filtersAppliedSignal()) {
        this.ngOnInit();
      }
    });
  }
  ngOnInit(): void {
    this.productService
      .getProductsCount(this.productService.queryOptions)
      .subscribe({
        next: (result) => {
          this.pagesNumber = Math.ceil(
            result.data.productsCount / this.productService.productsPerPage
          );
          this.pages = Array.from(
            { length: this.pagesNumber },
            (_, index) => index + 1
          );
        },
        error: (error) => {
          console.error('Error fetching products count:', error);
        },
      });
  }
  isCurrentPage(page: number) {
    return this.productService.currentProductsPageSignal() === page;
  }
  next() {
    this.productService
      .getProducts({
        ...this.productService.queryOptions,
        page: this.productService.currentProductsPageSignal()+1,
      })
      .subscribe({
        next: (result) => {
          this.productService.currentProductsPageSignal.set(
            this.productService.currentProductsPageSignal() + 1
          );
          this.productService.productsSignal.set(result.data.products || []);
        },
        error: (error) => console.error('Error fetching products:', error),
      });
  }
  previous() {
    this.productService.currentProductsPageSignal.set(
      this.productService.currentProductsPageSignal() - 1
    );
  }
  getPage(page: number) {
    this.productService.currentProductsPageSignal.set(page - 1);
    this.next();
  }
  isNextDisabled() {
    return this.productService.currentProductsPageSignal() === this.pagesNumber;
  }
  isPerviousDisabled() {
    return this.productService.currentProductsPageSignal() === 1;
  }
}

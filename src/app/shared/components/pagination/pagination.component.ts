import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  pagesNumber: number = 0;
  pages: number[] = [];
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.getProductsCount().subscribe({
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
        limit: this.productService.productsPerPage,
        page: this.productService.currentProductsPageSignal() + 1,
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
    this.productService.currentProductsPageSignal.set(page-1);
    this.next()
    
  }
  isNextDisabled() {
    return this.productService.currentProductsPageSignal() === this.pagesNumber;
  }
  isPerviousDisabled() {
    return this.productService.currentProductsPageSignal() === 1;
  }
}

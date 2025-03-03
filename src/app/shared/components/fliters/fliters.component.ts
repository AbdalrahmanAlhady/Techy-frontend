import { Component, OnInit } from '@angular/core';
import { Brand } from '../../models/Brand';
import { Category } from '../../models/Category';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { query } from '@angular/animations';

@Component({
  standalone: false,
  selector: 'app-filters',
  templateUrl: './fliters.component.html',
  styleUrls: ['./fliters.component.css'],
})
export class FiltersComponent implements OnInit {
  brands: Brand[] = [];
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  selectedBrands: Brand[] = [];
  priceRange!: { min: number; max: number } 
  selectedMaxPrice: number = 0;
  selectedMinPrice: number = 0;

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.getBrands();
    this.getCategories();
    this.getPriceRange();
  }

  getBrands() {
    return this.brandService.getBrands().subscribe({
      next: (result) => {
        this.brands = result.data.brands || [];
      },
      error: (error) => console.error('Error fetching brands:', error),
    });
  }
  getCategories() {
    return this.categoryService.getCategories().subscribe({
      next: (result) => {
        this.categories = result.data.categories || [];
      },
      error: (error) => console.error('Error fetching categories:', error),
    });
  }
  getPriceRange() {
    return this.productService
      .getProductsPriceRange(this.productService.queryOptions)
      .subscribe({
        next: (result) => {
          this.priceRange = result.data.productsPriceRange;
          this.selectedMaxPrice = this.priceRange.max;
          this.selectedMinPrice = this.priceRange.min;
        },
        error: (error) => console.error('Error fetching price range:', error),
      });
  }
 
  filter() {
    this.productService.queryOptions.filters = {
      category: this.selectedCategories.map((c) => c.id!),
      brand: this.selectedBrands.map((b) => b.id!),
      price: [this.selectedMinPrice.toString(), this.selectedMaxPrice.toString()],
    };

    this.productService
      .getProducts(this.productService.queryOptions)
      .subscribe({
        next: (result) => {
          this.productService.filtersAppliedSignal.set(false);
          this.productService.productsSignal.set(result.data.products || []);
        },
        error: (error) => console.error('Error fetching products:', error),
      });
  }
  resetFilters() {
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedMaxPrice = this.priceRange.max;
    this.selectedMinPrice = this.priceRange.min;
    this.productService.queryOptions.filters = {};
   
    this.productService
    .getProducts(this.productService.queryOptions)
    .subscribe({
      next: (result) => {
        this.productService.filtersAppliedSignal.set(true);
        this.productService.productsSignal.set(result.data.products || []);
      },
      error: (error) => console.error('Error fetching products:', error),
    });
  }
}

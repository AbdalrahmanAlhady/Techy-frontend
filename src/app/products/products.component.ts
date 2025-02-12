import { Component, effect, OnInit, untracked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Product } from '../shared/models/Product';
import { AuthService } from '../shared/services/auth.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { ProductService } from '../shared/services/product.service';

@Component({
  standalone: false,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  searchFieldControl = new FormControl('');
  products: Product[] = [];
  sortType: 'Price' | 'Name' | 'Default' = 'Default';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  allProductsMiniData: { id: string; name: string; cover: string }[] = [];
  filteredAllProductsMiniData!: Observable<
    { id: string; name: string; cover: string }[]
  >;
  constructor(
    private productService: ProductService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    effect(() => {
      this.products = this.productService.productsSignal();
    });
  }
  ngOnInit(): void {
    this.getProducts();
    this.getProductMiniData();
  }
  getProducts() {
    this.productService
      .getProducts(this.productService.queryOptions)
      .subscribe({
        next: (result) => {
          this.products = result.data.products || [];
          this.productService.productsSignal.set(this.products);
        },
        error: (error) => console.error('Error fetching products:', error),
      });
  }
  sort(sortType: 'Price' | 'Name' | 'Default', direction: 'ASC' | 'DESC') {
    this.products = [...this.products].sort((a, b) => {
      if (sortType === 'Price') {
        return direction === 'ASC' ? a.price - b.price : b.price - a.price;
      }
      if (sortType === 'Name') {
        return direction === 'ASC'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  }
  getProductMiniData() {
    this.productService.getProductsNames().subscribe({
      next: (result) => {
        this.allProductsMiniData = result.data.productsNames;

        this.filteredAllProductsMiniData = this.searchFieldControl.valueChanges.pipe(
          startWith(''),
          map((value) =>
            this.allProductsMiniData.filter((prod) =>
              prod.name.toLowerCase().includes(value!)
            )
          )
        );
      },
      error: (error) => console.error('Error fetching products:', error),
    });
  }
  viewProduct(productId: string) {
    console.log('view product:', productId);
    this.productService.getProducts(undefined, productId).subscribe({
      next: (result) => {
        let product = result.data.products[0];
        console.log('product:', result.data.products);
        this.localStorageService.removeItem('viewProduct');
        this.localStorageService.setItem('viewProduct', product);
        this.router.navigate(['product', productId]);
      },
      error: (error) => console.error('Error fetching products:', error),
    });
  }
}

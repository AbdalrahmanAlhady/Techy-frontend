import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../shared/models/Product';
import { Category } from '../shared/models/Category';
import { Brand } from '../shared/models/Brand';
import { Order } from '../shared/models/Order';
import { DataSource } from '@angular/cdk/collections';
import { BrandService } from '../shared/services/brand.service';
import { CategoryService } from '../shared/services/category.service';
import { OrderService } from '../shared/services/order.service';
import { Observable, of } from 'rxjs';
import { GQLQueryOptions } from '../shared/models/GQLQueryOptions';
import { ApolloQueryResult } from '@apollo/client/core';
import { UserService } from '../shared/services/user.service';
import { User, UserRole } from '../shared/models/User';
import { OrderItemService } from '../shared/services/order-item.service';
import { OrderItem } from '../shared/models/OrderItem';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  mode: 'Products' | 'Categories' | 'Brands' | 'Orders' | 'OrderItems' =
    'Products';
  pagesCount: number = 0;
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  orders: Order[] = [];
  orderItems: OrderItem[] = [];
  headers: string[] = [];
  data: any[] = [];
  isLoading: boolean = false;
  user!: User;
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private userService: UserService,
    private orderItemService: OrderItemService
  ) {}
  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    // this.user.role = UserRole.VENDOR;
    if (this.mode === 'Products') {
      this.getProducts();
    }
    this.getPagesCount();
  }
  onPageChange(event: any) {
    console.log(event);
  }
  getPagesCount() {
    if (this.mode === 'Products') {
      this.productService.getProductsCount().subscribe((result) => {
        this.pagesCount = Math.ceil(
          result.data.productsCount / this.productService.productsPerPage
        );
      });
    } else if (this.mode === 'Categories') {
      this.categoryService.getCategoriesCount().subscribe((result) => {
        this.pagesCount = Math.ceil(
          result.data.categoriesCount / this.categoryService.categoriesPerPage
        );
      });
    } else if (this.mode === 'Brands') {
      this.brandService.getBrandsCount().subscribe((result) => {
        this.pagesCount = Math.ceil(
          result.data.brandsCount / this.brandService.brandsPerPage
        );
      });
    } else if (this.mode === 'Orders') {
      this.orderService.getOrdersCount().subscribe((result) => {
        this.pagesCount = Math.ceil(
          result.data.ordersCount / this.orderService.ordersPerPage
        );
      });
    }
  }
  fetchData(
    serviceMethod: (args?: {
      options?: GQLQueryOptions;
      id?: string;
    }) => Observable<
      ApolloQueryResult<
        | { products: Product[] }
        | { categories: Category[] }
        | { brands: Brand[] }
        | { orders: Order[] }
        | { orderItems: OrderItem[] }
      >
    >,
    dataPath: string,
    excludeKeys: string[] = [],
    args?: {
      options?: GQLQueryOptions;
      id?: string;
    }
  ) {
    serviceMethod(args).subscribe((result) => {
      if (result) {
        const data = this.getDataByPath(result, dataPath);
        this.data = data.length > 0 ? data : [];
        this.headers =
          this.mode === 'OrderItems'
            ? [
                'itemName',
                'image',
                'quantity',
                'unitPrice',
                'totalPrice',
                'order_id',
                'main_order_status',
              ]
            : data.length > 0
            ? Object.keys(data[0]).filter((key) => !excludeKeys.includes(key))
            : [];
      }
    });
  }

  private getDataByPath(result: any, path: string): any[] {
    const data =
      path.split('.').reduce((acc, part) => acc && acc[part], result) || [];
    this.assignDataByMode(data);
    return data;
  }

  private assignDataByMode(data: any[]) {
    switch (this.mode) {
      case 'Products':
        this.products = data;
        break;
      case 'Categories':
        this.categories = data;
        break;
      case 'Brands':
        this.brands = data;
        break;
      case 'Orders':
        this.orders = data;
        break;
      case 'OrderItems':
        this.orderItems = data;
        break;
    }
  }

  getProducts() {
    let options: GQLQueryOptions =
      this.user.role === UserRole.VENDOR
        ? { filters: { vendor: [this.user.id] } }
        : {};
    this.fetchData(
      () => this.productService.getProducts({ page: 1, limit: 5, ...options }),
      'data.products',
      ['__typename', 'description']
    );
  }

  getCategories() {
    this.fetchData(
      () => this.categoryService.getCategories({ page: 1, limit: 5 }),
      'data.categories',
      ['__typename']
    );
  }

  getBrands() {
    this.fetchData(
      () => this.brandService.getBrands({ page: 1, limit: 5 }),
      'data.brands',
      ['__typename']
    );
  }

  getOrders() {
    this.fetchData(
      () => this.orderService.getOrders({ page: 1, limit: 5 }),
      'data.orders',
      ['__typename', 'orderItems', 'deliveryFee']
    );
  }
  getVendorOrdersItems() {
    this.fetchData(
      () => this.orderItemService.getOrderItems({ page: 1, limit: 5 }),
      'data.orderItems',
      ['__typename']
    );
  }
  changeMode(
    mode: 'Products' | 'Categories' | 'Brands' | 'Orders' | 'OrderItems'
  ) {
    this.mode = mode;
    if (mode === 'Products') {
      this.getProducts();
    } else if (mode === 'Categories') {
      this.getCategories();
    } else if (mode === 'Brands') {
      this.getBrands();
    } else if (mode === 'Orders') {
      this.getOrders();
    } else if (mode === 'OrderItems') {
      this.getVendorOrdersItems();
    }
    this.getPagesCount();
  }
}

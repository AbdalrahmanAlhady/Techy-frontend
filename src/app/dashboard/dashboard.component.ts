import { Component, effect, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../shared/models/Product';
import { Category } from '../shared/models/Category';
import { Brand } from '../shared/models/Brand';
import { Order } from '../shared/models/Order';
import { DataSource } from '@angular/cdk/collections';
import { BrandService } from '../shared/services/brand.service';
import { CategoryService } from '../shared/services/category.service';
import { OrderService } from '../shared/services/order.service';
import { map, Observable, of, startWith } from 'rxjs';
import { GQLQueryOptions } from '../shared/models/GQLQueryOptions';
import { ApolloQueryResult } from '@apollo/client/core';
import { UserService } from '../shared/services/user.service';
import { User, UserRole } from '../shared/models/User';
import { OrderItemService } from '../shared/services/order-item.service';
import { OrderItem } from '../shared/models/OrderItem';
import { ShareDataService } from '../shared/services/share-data.service';
import { FormControl } from '@angular/forms';

export enum EntityType {
  Product = 'Product',
  Category = 'Category',
  Brand = 'Brand',
  Order = 'Order',
  OrderItem = 'OrderItem',
  User = 'User',
}

export enum Operation {
  Create = 'Create',
  Update = 'Update',
  None = 'None',
}

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  EntityType = EntityType;
  Operation = Operation;
  entityType: EntityType = EntityType.Product;
  currentOperation: Operation = Operation.None;
  operationEnded: boolean = false;
  totalItemsCount: number = 0;
  pagesCount: number = 0;
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  orders: Order[] = [];
  orderItems: OrderItem[] = [];
  users: User[] = [];
  headers: string[] = [];
  data: any[] = [];
  isLoading: boolean = false;
  user!: User;
  editedEntity!: Product | Category | Brand | Order | OrderItem | User;
  editedEntityIndex: number = -1;
  sortType: 'Price' | 'Name' | 'Default' = 'Default';
  sortDirection: 'ASC' | 'DESC' = 'ASC';

  searchFieldControl = new FormControl('');
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private userService: UserService,
    private orderItemService: OrderItemService,
    private shareDataService: ShareDataService
  ) {
    effect(() => {
      const entity = this.shareDataService.updateOrCreateEntitySignal();
      if (entity) {
        this.currentOperation = Operation.None;
        switch (this.entityType) {
          case 'Product':
            this.products =
              this.editedEntityIndex !== -1
                ? this.products.map((item, idx) =>
                    idx === this.editedEntityIndex ? (entity as Product) : item
                  )
                : [...this.products, entity as Product];
            this.editedEntityIndex = -1;
            break;
          case 'Category':
            this.categories =
              this.editedEntityIndex !== -1
                ? this.categories.map((item, idx) =>
                    idx === this.editedEntityIndex ? (entity as Category) : item
                  )
                : [...this.categories, entity as Category];
            this.editedEntityIndex = -1;
            break;
          case 'Brand':
            this.brands =
              this.editedEntityIndex !== -1
                ? this.brands.map((item, idx) =>
                    idx === this.editedEntityIndex ? (entity as Brand) : item
                  )
                : [...this.brands, entity as Brand];
            this.editedEntityIndex = -1;
            break;
          case 'Order':
            this.orders =
              this.editedEntityIndex !== -1
                ? this.orders.map((item, idx) =>
                    idx === this.editedEntityIndex ? (entity as Order) : item
                  )
                : [...this.orders, entity as Order];
            this.editedEntityIndex = -1;
            break;
          case 'OrderItem':
            this.orderItems =
              this.editedEntityIndex !== -1
                ? this.orderItems.map((item, idx) =>
                    idx === this.editedEntityIndex
                      ? (entity as OrderItem)
                      : item
                  )
                : [...this.orderItems, entity as OrderItem];
            this.editedEntityIndex = -1;
            break;
          case 'User':
            this.users =
              this.editedEntityIndex !== -1
                ? this.users.map((item, idx) =>
                    idx === this.editedEntityIndex ? (entity as User) : item
                  )
                : [...this.users, entity as User];
            this.editedEntityIndex = -1;
            break;
        }
      }
    });
  }
  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    // this.user.role = UserRole.VENDOR;
    if (this.entityType === 'Product') {
      this.getProducts();
    }
    this.getPagesCount();
  }
  onPageChange(event: any) {
    if (this.entityType === 'Product') {
      this.getProducts(event.page + 1);
    } else if (this.entityType === 'Category') {
      this.getCategories(event.page + 1);
    } else if (this.entityType === 'Brand') {
      this.getBrands(event.page + 1);
    } else if (this.entityType === 'Order') {
      this.getOrders(event.page + 1);
    } else if (this.entityType === 'OrderItem') {
      this.getVendorOrdersItems(event.page + 1);
    } else if (this.entityType === 'User') {
      this.getUsers(event.page + 1);
    }
  }
  getPagesCount() {
    if (this.entityType === 'Product') {
      let options: GQLQueryOptions =
        this.user.role === UserRole.VENDOR
          ? { filters: { vendor: [this.user.id] } }
          : {};
      this.productService.getProductsCount(options).subscribe((result) => {
        this.totalItemsCount = result.data.productsCount;
        this.pagesCount = Math.ceil(
          result.data.productsCount / this.productService.productsPerPage
        );
      });
    } else if (this.entityType === 'Category') {
      this.categoryService.getCategoriesCount().subscribe((result) => {
        this.totalItemsCount = result.data.categoriesCount;
        this.pagesCount = Math.ceil(
          result.data.categoriesCount / this.categoryService.categoriesPerPage
        );
      });
    } else if (this.entityType === 'Brand') {
      this.brandService.getBrandsCount().subscribe((result) => {
        this.totalItemsCount = result.data.brandsCount;
        this.pagesCount = Math.ceil(
          result.data.brandsCount / this.brandService.brandsPerPage
        );
      });
    } else if (this.entityType === 'Order') {
      this.orderService.getOrdersCount().subscribe((result) => {
        this.totalItemsCount = result.data.ordersCount;
        this.pagesCount = Math.ceil(
          result.data.ordersCount / this.orderService.ordersPerPage
        );
      });
    } else if (this.entityType === 'User') {
      this.userService.getUsersCount().subscribe((result) => {
        this.totalItemsCount = result.data.usersCount;
        this.pagesCount = Math.ceil(
          result.data.usersCount / this.userService.usersPerPage
        );
      });
    } else if (this.entityType === 'OrderItem') {
      //if vendor
      this.orderItemService
        .getOrderItemsCount({}, '', this.user.id + '')
        .subscribe((result) => {
          this.totalItemsCount = result.data.orderItemsCount;
          this.pagesCount = Math.ceil(
            result.data.orderItemsCount /
              this.orderItemService.orderItemsPerPage
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
        | { users: User[] }
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
          this.entityType === 'OrderItem'
            ? [
                'itemName',
                'image',
                'quantity',
                'unitPrice',
                'totalPrice',
                'order_id',
                'main_order_status',
              ]
            : this.entityType === 'User'
            ? ['id', 'name', 'email', 'verified', 'role']
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
    switch (this.entityType) {
      case 'Product':
        this.products = data;
        break;
      case 'Category':
        this.categories = data;
        break;
      case 'Brand':
        this.brands = data;
        break;
      case 'Order':
        this.orders = data;
        break;
      case 'OrderItem':
        this.orderItems = data;
        break;
      case 'User':
        this.users = data;
        break;
    }
  }

  getProducts(page: number = 1) {
    let options: GQLQueryOptions =
      this.user.role === UserRole.VENDOR
        ? { filters: { vendor: [this.user.id] } }
        : {};
    this.fetchData(
      () => this.productService.getProducts({ page, limit: 5, ...options }),
      'data.products',
      ['__typename', 'description']
    );
  }

  getCategories(page: number = 1) {
    this.fetchData(
      () => this.categoryService.getCategories({ page, limit: 5 }),
      'data.categories',
      ['__typename']
    );
  }

  getBrands(page: number = 1) {
    this.fetchData(
      () => this.brandService.getBrands({ page, limit: 5 }),
      'data.brands',
      ['__typename']
    );
  }

  getOrders(page: number = 1) {
    this.fetchData(
      () => this.orderService.getOrders({ page, limit: 5 }),
      'data.orders',
      ['__typename', 'orderItems', 'deliveryFee']
    );
  }
  getUsers(page: number = 1) {
    this.fetchData(
      () => this.userService.getUsers({ page, limit: 5 }),
      'data.users',
      ['__typename']
    );
  }
  getVendorOrdersItems(page: number = 1) {
    this.fetchData(
      () =>
        this.orderItemService.getOrderItems(
          { page, limit: 5 },
          '',
          '',
          this.user.id + ''
        ),
      'data.orderItems',
      ['__typename']
    );
  }
  changeEntityType(entityType: EntityType) {
    this.currentOperation = Operation.None;
    this.entityType = entityType;
    if (entityType === 'Product') {
      this.getProducts();
    } else if (entityType === 'Category') {
      this.getCategories();
    } else if (entityType === 'Brand') {
      this.getBrands();
    } else if (entityType === 'Order') {
      this.getOrders();
    } else if (entityType === 'OrderItem') {
      this.getVendorOrdersItems();
    } else if (entityType === 'User') {
      this.getUsers();
    }
    this.getPagesCount();
  }
  deleteItem(
    type: 'Product' | 'Category' | 'Brand' | 'Order' | 'OrderItem' | 'User',
    id: string
  ) {
    if (type === 'Product') {
      this.productService.deleteProduct(id).subscribe((res) => {
        if (res.data?.deleteProduct) {
          this.products = this.products.filter((product) => product.id !== id);
        }
      });
    } else if (type === 'Category') {
      this.categoryService.deleteCategory(id).subscribe((res) => {
        if (res.data?.deleteCategory) {
          this.categories = this.categories.filter(
            (category) => category.id !== id
          );
        }
      });
    } else if (type === 'Brand') {
      this.brandService.deleteBrand(id).subscribe((res) => {
        if (res.data?.deleteBrand) {
          this.brands = this.brands.filter((brand) => brand.id !== id);
        }
      });
    } else if (type === 'Order') {
      this.orderService.deleteOrder(id).subscribe((res) => {
        if (res.data?.deleteOrder) {
          this.orders = this.orders.filter((order) => order.id !== id);
        }
      });
    } else if (type === 'OrderItem') {
      this.orderItemService.deleteOrderItem(id).subscribe((res) => {
        if (res.data?.deleteOrderItem) {
          this.orderItems = this.orderItems.filter(
            (orderItem) => orderItem.id !== id
          );
        }
      });
    } else if (type === 'User') {
      this.userService.deleteUser(id).subscribe((res) => {
        if (res.data?.deleteUser) {
          this.users = this.users.filter((user) => user.id !== id);
        }
      });
    }
  }
  editItem(
    entity: Product | Category | Brand | Order | OrderItem | User,
    index: number
  ) {
    this.editedEntityIndex = index;
    this.editedEntity = entity;
    this.currentOperation = Operation.Update;
  }
 
}

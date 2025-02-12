import { Component, Input, OnInit } from '@angular/core';
import { User, UserRole } from '../../shared/models/User';
import { ProductService } from '../../shared/services/product.service';
import { BrandService } from '../../shared/services/brand.service';
import { CategoryService } from '../../shared/services/category.service';
import { OrderService } from '../../shared/services/order.service';
import { UserService } from '../../shared/services/user.service';
import { GQLQueryOptions } from '../../shared/models/GQLQueryOptions';
import { OrderItemService } from '../../shared/services/order-item.service';

@Component({
  standalone: false,
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  @Input() user!: User;
  productsCount: number = 0;
  categoriesCount: number = 0;
  brandsCount: number = 0;
  ordersCount: number = 0;
  orderItemsCount: number = 0;
  usersCount: number = 0;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private orderService: OrderService,
    private userService: UserService,
    private orderItemService: OrderItemService
  ) {}
  ngOnInit(): void {
    this.getTotalProductsCount();
    this.getTotalCategoriesCount();
    this.getTotalBrandsCount();
    if (this.user.role === UserRole.ADMIN) this.getTotalOrdersCount();
    if (this.user.role === UserRole.VENDOR) this.getTotalOrderItemsCount();
    this.getTotalUsersCount();
  }
  getTotalProductsCount() {
    let options: GQLQueryOptions =
      this.user.role === UserRole.VENDOR
        ? { filters: { vendor: [this.user.id] } }
        : {};
    this.productService.getProductsCount({ ...options }).subscribe((res) => {
      this.productsCount = res.data.productsCount;
    });
  }
  getTotalCategoriesCount() {
    this.categoryService.getCategoriesCount().subscribe((res) => {
      this.categoriesCount = res.data.categoriesCount;
    });
  }
  getTotalBrandsCount() {
    this.brandService.getBrandsCount().subscribe((res) => {
      this.brandsCount = res.data.brandsCount;
    });
  }
  getTotalOrdersCount() {
    this.orderService.getOrdersCount().subscribe((res) => {
      this.ordersCount = res.data.ordersCount;
    });
  }
  getTotalOrderItemsCount() {
    this.orderItemService
      .getOrderItemsCount({}, '', this.user.id + '')
      .subscribe((res) => {
        this.orderItemsCount = res.data.orderItemsCount;
        console.log(res);
      });
  }
  getTotalUsersCount() {
    this.userService.getUsersCount().subscribe((res) => {
      this.usersCount = res.data.usersCount;
    });
  }
}

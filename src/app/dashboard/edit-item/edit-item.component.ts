import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomvalidationService } from '../../auth/services/customvalidation.service';
import { Brand } from '../../shared/models/Brand';
import { Category } from '../../shared/models/Category';
import { Order, OrderStatus } from '../../shared/models/Order';
import { OrderItem } from '../../shared/models/OrderItem';
import { Product } from '../../shared/models/Product';
import { User, UserRole } from '../../shared/models/User';
import { BrandService } from '../../shared/services/brand.service';
import { CategoryService } from '../../shared/services/category.service';
import { CloudinaryService } from '../../shared/services/cloudinary.service';
import { OrderItemService } from '../../shared/services/order-item.service';
import { OrderService } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
import { ShareDataService } from '../../shared/services/share-data.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit {
  @Input() entityType!:
    | 'Brand'
    | 'Category'
    | 'Order'
    | 'OrderItem'
    | 'Product'
    | 'User';
  @Input() entity!: Brand | Category | Order | OrderItem | Product | User;
  @Input() operationType!: 'Create' | 'Update';
  entityForm: FormGroup;
  userRoles = UserRole;
  backendError: string = '';
  productCover!: File;
  productCoverUrl: string = '';
  categories: Category[] = [];
  brands: Brand[] = [];
  orderStatus = OrderStatus;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private orderItemService: OrderItemService,
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService,
    private sharedDataService: ShareDataService,
    public customValidator: CustomvalidationService,
    private cloudinaryService: CloudinaryService
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getBrands();
    this.getCategories();
    this.initializeForm();
    if (this.operationType === 'Update' && this.entity) {
      this.loadEntityData();
    }
  }
  getOrderStatusValues() {
    return Object.values(this.orderStatus);
  }
  getBrands() {
    this.brandService.getBrands().subscribe({
      next: (result) => {
        this.brands = result.data.brands || [];
      },
      error: (error) => console.error('Error fetching brands:', error),
    });
  }
  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (result) => {
        this.categories = result.data.categories || [];
      },
      error: (error) => console.error('Error fetching categories:', error),
    });
  }
  uploadProductCover(id: string, image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cloudinaryService.uploadFile(image, id + '-cover').subscribe({
        next: (response) => {
          console.log('Uploaded file URL:', response.secure_url);
          this.productCoverUrl = response.secure_url;
          resolve(this.productCoverUrl);
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
      });
    });
  }
  initializeForm() {
    switch (this.entityType) {
      case 'Brand':
        this.entityForm = this.formBuilder.group({
          name: ['', Validators.required],
        });
        break;
      case 'Category':
        this.entityForm = this.formBuilder.group({
          name: ['', Validators.required],
        });
        break;
      case 'Order':
        this.entityForm = this.formBuilder.group({
          orderStatus: ['', Validators.required],
          deliveryFee: ['', Validators.required],
          totalAmount: ['', Validators.required],
          address: ['', Validators.required],
          userId: ['', Validators.required],
        });
        break;
      case 'OrderItem':
        this.entityForm = this.formBuilder.group({
          quantity: ['', Validators.required],
          unitPrice: ['', Validators.required],
          totalPrice: ['', Validators.required],
          productId: ['', Validators.required],
          orderId: ['', Validators.required],
        });
        break;
      case 'Product':
        this.entityForm = this.formBuilder.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          price: [0, Validators.required],
          category: ['', Validators.required],
          brand: ['', Validators.required],
          cover: [''],
          inventory: [0, Validators.required],
        });
        break;
      case 'User':
        this.entityForm = this.formBuilder.group({
          role: [UserRole.BUYER, Validators.required],
          firstName: [
            '',
            [
              Validators.required,
              Validators.maxLength(20),
              Validators.minLength(2),
            ],
          ],
          lastName: [
            '',
            [
              Validators.required,
              Validators.maxLength(20),
              Validators.minLength(2),
            ],
          ],
          email: [
            '',
            Validators.compose([
              Validators.required,
              Validators.email,
              Validators.pattern('.*com$'),
              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
            ]),
          ],
          verified: [false, Validators.required],
        });
        break;
    }
  }

  loadEntityData() {
    this.entityForm.patchValue(this.entity);
    if (this.entityType === 'Product') {
      this.entityForm.patchValue({
        brand: (this.entity as Product).brand.id,
        category: (this.entity as Product).category.id,
      });
      this.productCoverUrl = (this.entity as Product).cover;
    }
    else if (this.entityType === 'Order') {
      this.entityForm.patchValue({
       userId: (this.entity as Order).user!.id
      })
    }
    console.log(this.entityForm);
  }

  saveEntity() {
    if (this.entityForm.invalid) {
      return;
    }
    const formData = this.entityForm.value;
    if (this.operationType === 'Create') {
      switch (this.entityType) {
        case 'Brand':
          this.brandService.createBrand(formData.name).subscribe({
            next: (result) =>
              this.sharedDataService.updateOrCreateEntitySignal.set(
                result.data?.createBrand!
              ),
            error: (error) => (this.backendError = error.message),
          });
          break;
        case 'Category':
          this.categoryService.createCategory(formData.name).subscribe({
            next: (result) =>
              this.sharedDataService.updateOrCreateEntitySignal.set(
                result.data?.createCategory!
              ),
            error: (error) => (this.backendError = error.message),
          });
          break;
        case 'Order':
          this.orderService
            .createOrder(
              '',
              formData.orderItems,
              formData.userId,
              formData.totalAmount,
              formData.deliveryFee,
              formData.address
            )
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.createOrder!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
        case 'OrderItem':
          this.orderItemService
            .createOrderItem(
              formData.quantity,
              formData.unitPrice,
              formData.totalPrice,
              formData.orderId,
              formData.productId
            )
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.createOrderItem!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
        case 'Product':
          this.productService
            .createProduct(
              formData.name,
              formData.description,
              formData.price * 1,
              formData.category,
              formData.brand,
              formData.cover,
              formData.inventory * 1,
              this.userService.getCurrentUser().id + ''
            )
            .subscribe({
              next: (result) => {
                if (this.productCover) {
                  this.uploadProductCover(
                    result.data?.createProduct!.id!,
                    this.productCover
                  ).then((imageUrl) => {
                    this.productService
                      .updateProduct(
                        result.data?.createProduct!.id!,
                        undefined,
                        undefined,
                        undefined,
                        imageUrl
                      )
                      .subscribe({
                        next: (updateResult) => {
                          this.sharedDataService.updateOrCreateEntitySignal.set(
                            updateResult.data?.updateProduct!
                          );
                        },
                        error: (error) => (this.backendError = error.message),
                      });
                  });
                } else {
                  this.sharedDataService.updateOrCreateEntitySignal.set(
                    result.data?.createProduct!
                  );
                }
              },
              error: (error) => (this.backendError = error.message),
            });
          break;
        case 'User':
          this.userService
            .createUser(
              formData.role,
              formData.password,
              formData.email,
              formData.lastName,
              formData.firstName
            )
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.createUser!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
      }
    } else if (this.operationType === 'Update') {
      
      switch (this.entityType) {
        case 'Brand':
          this.brandService
            .updateBrand(this.entity.id!, formData.name)
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.updateBrand!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
        case 'Category':
          this.categoryService
            .updateCategory(this.entity.id!, formData.name)
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.updateCategory!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
        case 'Order':
          this.orderService
            .updateOrder(
              this.entity.id!,
              formData.deliveryFee,
              formData.totalAmount,
              formData.orderStatus,
              formData.address
            )
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.updateOrder!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
        case 'OrderItem':
          this.orderItemService
            .updateOrderItem(
              this.entity.id!,
              formData.quantity,
              formData.unitPrice,
              formData.totalPrice
            )
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.updateOrderItem!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
        case 'Product':
          if (this.productCover) {
            this.uploadProductCover(this.entity.id!, this.productCover).then(
              (imageUrl) => {
                this.productService
                  .updateProduct(
                    this.entity.id!,
                    formData.name,
                    formData.price * 1,
                    formData.inventory * 1,
                    this.productCoverUrl
                  )
                  .subscribe({
                    next: (result) =>
                      this.sharedDataService.updateOrCreateEntitySignal.set(
                        result.data?.updateProduct!
                      ),
                    error: (error) => (this.backendError = error.message),
                  });
              }
            );
          } else {
            this.productService
              .updateProduct(
                this.entity.id!,
                formData.name,
                formData.price * 1,
                formData.inventory * 1,
                this.productCoverUrl
              )
              .subscribe({
                next: (result) => {
                  this.sharedDataService.updateOrCreateEntitySignal.set(
                    result.data?.updateProduct!
                  );
                  window.location.reload();
                },
                error: (error) => (this.backendError = error.message),
              });
          }
          break;
        case 'User':
          this.userService
            .updateUser(
              this.entity.id!+'',
              formData.role,
              formData.password,
              formData.email,
              formData.lastName,
              formData.firstName,
              formData.verified
            )
            .subscribe({
              next: (result) =>
                this.sharedDataService.updateOrCreateEntitySignal.set(
                  result.data?.updateUser!
                ),
              error: (error) => (this.backendError = error.message),
            });
          break;
      }
    }
  }
  onProductCoverSelect(event: any) {
    const file = event.files[0];
    this.productCover = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.productCoverUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

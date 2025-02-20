import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './products/components/product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { SigninComponent } from './auth/components/signin/signin.component';
import { AuthPageGuard } from './auth/services/authPage.guard.service';
import { AuthGuard } from './auth/services/auth.guard.service';
import { OrderComponent } from './myorders/order/order.component';
import { MyordersComponent } from './myorders/myorders.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';

const routes: Routes = [
  { component: ProductsComponent, path: '', pathMatch: 'full' },
  { component: ProductDetailsComponent, path: 'product/:id' },
  { component: CartComponent, canActivate: [AuthGuard], path: 'cart' },
  {
    component: DashboardComponent,
    canActivate: [AuthGuard],
    path: 'dashboard',
  },
  { component: SignupComponent, canActivate: [AuthPageGuard], path: 'signup' },
  { component: SigninComponent, canActivate: [AuthPageGuard], path: 'signin' },
  { component: MyordersComponent, canActivate: [AuthGuard], path: 'myorders' },
  {
    component: PersonalInfoComponent,
    canActivate: [AuthGuard],
    path: 'personal-info',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

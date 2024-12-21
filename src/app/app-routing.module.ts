import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {component: ProductsComponent, path: '',pathMatch: 'full'},
  {component: ProductDetailsComponent, path: 'product/:id'},
  {component: CartComponent, path: 'cart'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

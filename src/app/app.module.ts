import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IconsBaseComponent } from './shared/icons/icons-base/icons-base.component';
import { LogoComponent } from './shared/icons/logo/logo.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CarouselComponent } from './shared/components/carousel/carousel.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CloudinaryModule } from '@cloudinary/ng';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NavbarComponent,
    ProductDetailsComponent,
    CartComponent,
    DashboardComponent,
    IconsBaseComponent,
    LogoComponent,
    ProductCardComponent,
    FooterComponent,
    CarouselComponent,
    PaginationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    CarouselModule,
    GraphQLModule,
    HttpClientModule,
    CloudinaryModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

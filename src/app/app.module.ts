import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatSliderModule } from '@angular/material/slider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';

import { NgxStripeModule } from 'ngx-stripe';

import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IconsBaseComponent } from './shared/icons/icons-base/icons-base.component';
import { LogoComponent } from './shared/icons/logo/logo.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CarouselComponent } from './shared/components/carousel/carousel.component';
import { GraphQLModule } from './graphql.module';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { CloudinaryModule } from '@cloudinary/ng';
import { ProductPaginationComponent } from './shared/components/product-pagination/product-pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { SigninComponent } from './auth/components/signin/signin.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { UpdateDoneSvgComponent } from './shared/icons/update-done-svg/update-done-svg.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { VerifyOtpComponent } from './shared/components/verify-otp/verify-otp.component';
import { OptEmailSvgComponent } from './shared/icons/opt-email-svg/opt-email-svg.component';
import { EmailVerifiedSvgComponent } from './shared/icons/email-verified-svg/email-verified-svg.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FileUploadModule } from 'primeng/fileupload';


import { ProductDetailsComponent } from './products/components/product-details/product-details.component';
import { ProductCardComponent } from './products/components/product-card/product-card.component';
import { FiltersComponent } from './shared/components/fliters/fliters.component';
import { SortArrowUpComponent } from './shared/icons/sort-arrow-up/sort-arrow-up.component';
import { SortArrowDownComponent } from './shared/icons/sort-arrow-down/sort-arrow-down.component';
import { AuthInterceptor } from './auth/services/auth_interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { FormFieldComponent } from './shared/components/form-field/form-field.component';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { UploadSvgComponent } from './shared/icons/upload-svg/upload-svg.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';
import { EditItemComponent } from './dashboard/edit-item/edit-item.component';
import { MyordersComponent } from './myorders/myorders.component';
import { OrderComponent } from './myorders/order/order.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PaymentDoneComponent } from "./shared/icons/payment-done/payment-done.component";

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
    ProductPaginationComponent,
    AuthComponent,
    SignupComponent,
    SigninComponent,
    UpdateDoneSvgComponent,
    ModalComponent,
    VerifyOtpComponent,
    OptEmailSvgComponent,
    EmailVerifiedSvgComponent,
    FiltersComponent,
    SortArrowUpComponent,
    SortArrowDownComponent,
    EditItemComponent,
    FormFieldComponent,
    StatisticsComponent,
    UploadSvgComponent,
    MyordersComponent,
    OrderComponent,
    PersonalInfoComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    CarouselModule,
    GraphQLModule,
    CloudinaryModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    ModalModule.forRoot(),
    MatListModule,
    MatExpansionModule,
    MatTreeModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatGridListModule,
    FileUploadModule,
    ButtonModule,
    ImageModule,
    CardModule,
    PaginatorModule,
    DividerModule,
    ChipModule,
    NgxStripeModule.forRoot(),
    PaymentDoneComponent,
    MatTabsModule,
    
],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideAnimationsAsync('noop'),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/main/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/main/footer/footer.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { ViewProductComponent } from './components/management/products/view-product/view-product.component';
import { AddProductComponent } from './components/management/products/add-product/add-product.component';
import { UpdateProductComponent } from './components/management/products/update-product/update-product.component';
import { ViewBrandComponent } from './components/management/brands/view-brand/view-brand.component';
import { AddBrandComponent } from './components/management/brands/add-brand/add-brand.component';
import { UpdateBrandComponent } from './components/management/brands/update-brand/update-brand.component';
import { ViewAccountComponent } from './components/management/account/view-account/view-account.component';
import { AddAccountComponent } from './components/management/account/add-account/add-account.component';
import { ViewOrderComponent } from './components/management/orders/view-order/view-order.component';
import { OrderDetailComponent } from './components/management/orders/order-detail/order-detail.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { OrderHistoryComponent } from './components/user/order-history/order-history.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { OldPasswordComponent } from './components/user/change-password/old-password/old-password.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password/change-password.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ProductSearchBrandComponent } from './components/product-search-brand/product-search-brand.component';
import { StatisticProductTableComponent } from './components/management/statistical/statistic-product/statistic-product-table/statistic-product-table.component';
import { StatisticProductChartComponent } from './components/management/statistical/statistic-product/statistic-product-chart/statistic-product-chart.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { StatisticByMonthChartComponent } from './components/management/statistical/statistic-byMonth/statistic-by-month-chart/statistic-by-month-chart.component';
import { StatisticByMonthTableComponent } from './components/management/statistical/statistic-byMonth/statistic-by-month-table/statistic-by-month-table.component';
import { ChatBotComponent } from './components/main/chat-bot/chat-bot.component';
import { OrderHistoryDetailComponent } from './components/user/order-history-detail/order-history-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    ProductComponent,
    ProductDetailsComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    ViewProductComponent,
    AddProductComponent,
    UpdateProductComponent,
    ViewBrandComponent,
    AddBrandComponent,
    UpdateBrandComponent,
    ViewAccountComponent,
    AddAccountComponent,
    ViewOrderComponent,
    OrderDetailComponent,
    ProfileComponent,
    OrderHistoryComponent,
    ResetPasswordComponent,
    ProductSearchComponent,
    OldPasswordComponent,
    ChangePasswordComponent,
    ProductSearchBrandComponent,
    StatisticProductTableComponent,
    StatisticProductChartComponent,
    StatisticByMonthChartComponent,
    StatisticByMonthTableComponent,
    ChatBotComponent,
    OrderHistoryDetailComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SlickCarouselModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductComponent } from './components/product/product.component';
import { NgbScrollSpyConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
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
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { authGuard } from './Guard/auth.guard';
import { OldPasswordComponent } from './components/user/change-password/old-password/old-password.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password/change-password.component';
import { ProductSearchBrandComponent } from './components/product-search-brand/product-search-brand.component';
import { StatisticProductTableComponent } from './components/management/statistical/statistic-product/statistic-product-table/statistic-product-table.component';
import { StatisticProductChartComponent } from './components/management/statistical/statistic-product/statistic-product-chart/statistic-product-chart.component';
import { StatisticByMonthTableComponent } from './components/management/statistical/statistic-byMonth/statistic-by-month-table/statistic-by-month-table.component';
import { StatisticByMonthChartComponent } from './components/management/statistical/statistic-byMonth/statistic-by-month-chart/statistic-by-month-chart.component';
import { OrderHistoryDetailComponent } from './components/user/order-history-detail/order-history-detail.component';


const routes: Routes = [
  {path:'', component: HomepageComponent},
  {path:'Product', component: ProductComponent},
  {path:'Product-Details/:id', component: ProductDetailsComponent},
  {path:'Cart', component: CartComponent},
  {path:'Login', component: LoginComponent},
  {path:'Register', component: RegisterComponent},
  {path:'View-Product', component: ViewProductComponent},
  {path:'Add-Product', component: AddProductComponent},
  {path:'Update-Product/:id', component: UpdateProductComponent},
  {path:'View-Brand', component: ViewBrandComponent, canActivate: [authGuard]},
  {path:'Add-Brand', component: AddBrandComponent, canActivate: [authGuard]},
  {path:'Update-Brand/:id', component: UpdateBrandComponent, canActivate: [authGuard]},
  {path:'View-Account', component: ViewAccountComponent, canActivate: [authGuard]},
  {path:'Add-Account', component: AddAccountComponent, canActivate: [authGuard]},
  {path:'View-Order', component: ViewOrderComponent},
  {path:'Order-Detail/:id', component: OrderDetailComponent},
  {path:'Order-History-Detail/:id', component: OrderHistoryDetailComponent},
  {path:'Order-History', component: OrderHistoryComponent},
  {path:'Profile', component: ProfileComponent},
  {path:'Reset-Password', component: ResetPasswordComponent},
  {path: 'Product-Search/:key', component: ProductSearchComponent},
  {path: 'Old-Password', component: OldPasswordComponent},
  {path: 'Change-Password', component: ChangePasswordComponent},
  {path: 'Statistic-Product-Table', component: StatisticProductTableComponent},
  {path: 'Statistic-Product-Chart', component: StatisticProductChartComponent},
  {path: 'Product-Search-Brand/:brandKey', component: ProductSearchBrandComponent},
  {path: 'Statistic-byMonth-Table', component: StatisticByMonthTableComponent},
  {path: 'Statistic-byMonth-Chart', component: StatisticByMonthChartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

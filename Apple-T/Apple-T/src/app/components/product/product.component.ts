import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiCartService } from 'src/app/services/api-cart.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  public lstProduct : any = [];
  path:string = '';

  fullname:string = '';

  cartID:number = 0;
  pageSize = 12;
  currentPage = 1;

  constructor(
    private apiProduct:ApiProductService,
    private router:Router,
    private apiCart:ApiCartService,
    private toast:ToastrService,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.viewAllProduct();

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    })

    this.api.getUserId(this.fullname).subscribe(data => {
      this.cartID = data;
    })
  }

  viewAllProduct(){
    this.apiProduct.getAllProductWithStatusYes().subscribe(data => {
      this.lstProduct = data;
      this.path = this.apiProduct.PhotoUrl + "/";
    })
  }

  addCart(productID:number, qty:number){
    if(this.api.isLoggedIn()){
      const obj = {
        cd_quantity : qty,
        cd_cart_id : this.cartID,
        cd_product_id : productID
      }

      this.apiCart.addCart(obj).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
      },
      error => {
        this.toast.error(error.error.message, 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
      })
    }
    else{
      this.toast.warning("Please login first", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
      this.router.navigate(['login']);
    }
  }
}

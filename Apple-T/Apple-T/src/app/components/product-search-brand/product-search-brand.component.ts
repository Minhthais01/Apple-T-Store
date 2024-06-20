import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiBrandService } from 'src/app/services/api-brand.service';
import { ApiCartService } from 'src/app/services/api-cart.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-product-search-brand',
  templateUrl: './product-search-brand.component.html',
  styleUrls: ['./product-search-brand.component.css']
})
export class ProductSearchBrandComponent implements OnInit{
  public brandKey : string = '';
  public lstBrand : any = [];
  public lstProduct : any = [];
  cartID:number = 0;
  path:string = '';
  fullname:string = '';
  

  constructor(
    private api:ApiService,
    private apiCart: ApiCartService,
    private router:Router,
    private toast:ToastrService,
    private apiBrand:ApiBrandService,
    private activatedRouter: ActivatedRoute,
    private apiProduct : ApiProductService,
    private userStore: UserStoreService
    
  ){}
  
  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.brandKey = params['brandKey'];
      this.searchBrand(this.brandKey);
      this.path = this.apiProduct.PhotoUrl + "/";
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    })

    this.api.getUserId(this.fullname).subscribe(data => {
      this.cartID = data;
    })
    // this.searchBrand(this.brandKey);
  }

  searchBrand(brandKey:any){
    this.apiBrand.getProductByBrand(brandKey).subscribe(data => {
      this.lstProduct = data;
      console.log(this.lstProduct);
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
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

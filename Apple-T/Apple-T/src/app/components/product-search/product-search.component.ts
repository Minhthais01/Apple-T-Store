import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiCartService } from 'src/app/services/api-cart.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit{
  key:string = '';
  brandKey:string = '';

  lstProduct : any = [];
  path:string = '';

  fullname:string = '';

  cartID:number = 0;

  constructor(
    private activatedRouter: ActivatedRoute,
    private apiProduct:ApiProductService,
    private toast: ToastrService,
    private api:ApiService,
    private userStore:UserStoreService,
    private apiCart: ApiCartService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.key = params['key'];
      this.search(this.key);
      this.path = this.apiProduct.PhotoUrl + "/";
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    })

    this.api.getUserId(this.fullname).subscribe(data => {
      this.cartID = data;
    })
  }

  search(key:any){
    this.apiProduct.search(key).subscribe(data => {
      this.lstProduct = data;
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

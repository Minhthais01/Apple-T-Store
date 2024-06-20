import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiCartService } from 'src/app/services/api-cart.service';
import { ApiImageService } from 'src/app/services/api-image.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  public productId : number = 0;
  public lstProduct : any = [];
  public lstImage : any = [];
  path:string = '';
  proQty:number = 1;
  fullname:string = '';
  cartID:number = 0;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true
  }

  constructor(
    private apiProduct:ApiProductService,
    private router:Router,
    private activatedRouter:ActivatedRoute,
    private apiCart:ApiCartService,
    private userStore:UserStoreService,
    private api:ApiService,
    private toast:ToastrService,
    private imageAPI : ApiImageService
  ){}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.productId = +params['id'];
      this.getProduct(this.productId);
      this.getImage(this.productId);
    })

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    })

    this.api.getUserId(this.fullname).subscribe(data => {
      this.cartID = data;
    })
  }

  getProduct(proId:number){
    this.apiProduct.getProductById(proId).subscribe(data => {
      this.lstProduct = data;
      this.path = this.apiProduct.PhotoUrl + "/";
    })
  }

  getImage(proId:number){
    this.imageAPI.GetImageByProId(proId).subscribe(data => {
      this.lstImage = data;
    });
  }

  getQty(event:any){
    this.proQty = event.target.value;
  }

  addCart(){
    const obj = {
      cd_quantity : this.proQty,
      cd_cart_id : this.cartID,
      cd_product_id : this.productId
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
}

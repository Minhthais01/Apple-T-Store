import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiBrandService } from 'src/app/services/api-brand.service';
import { ApiProductService } from 'src/app/services/api-product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit{
  public lstProduct:any = [];
  public lstBrand : any = [];
  public productId : number = 0;

  path:string = '';
  selectBrand : string = '';
  brandID:number = 0;
  productForm!:FormGroup;
  image:any;
  name:string = '';

  file!: File;

  showImage : boolean = false;
  hideImage : boolean = true;

  p_name: string = "";
  p_quantity: string = "";
  p_originalprice:string = "";
  p_sellprice:string = "";
  p_description:string = "";
  p_brand_id:number = 0;
  p_image:string = '';
  p_brandName:string = "";
  p_status:string = "";

  constructor(
    private fb:FormBuilder,
    private apiProduct:ApiProductService,
    private activatedRouter:ActivatedRoute,
    private apiBrand:ApiBrandService,
    private toast:ToastrService,
    private router:Router,
  ){}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.productId = +params['id'];
      this.getProduct(this.productId);
    });
    this.path = this.apiProduct.PhotoUrl + "/";

    this.apiBrand.getAllBrand().subscribe(data => {
      this.lstBrand = data;
    });
  }

  nameChange(event:any){
    this.p_name = event.target.value;
  }
  qtyChange(event:any){
    this.p_quantity = event.target.value;
  }
  oPriceChange(event:any){
    this.p_originalprice = event.target.value;
  }
  sPriceChange(event:any){
    this.p_sellprice = event.target.value;
  }
  descriptionChange(event:any){
    this.p_description = event.target.value;
  }

  uploadImage(event:any){
    const file: FileList | null = event.target.files;

    if(file && file.length > 0){
      this.showImage = true;
      this.hideImage = false;

      this.file = event.target.files[0];
      const formData:FormData = new FormData();
      formData.append('uploadedFile', this.file, this.file.name)

      this.apiProduct.uploadImage(formData).subscribe((data:any) => {
        this.name = data.toString();
        this.image = data.toString();
        this.path = this.apiProduct.PhotoUrl + "/" + this.image;
      })
    }
  }

  onSelectBrand(event:any):void{
    this.selectBrand = event.target.value;
    this.apiBrand.getId(this.selectBrand).subscribe(data => {
      this.brandID = data;
    })
  }

  onSelectStatus(event:any){
    this.p_status = event.target.value;
  }

  getProduct(proId:number){
    this.apiProduct.getProductById(proId).subscribe(data => {
      this.lstProduct = data;

      for(const product of this.lstProduct){
        this.p_name = product.product_name;
        this.p_originalprice = product.product_original_price;
        this.p_quantity = product.product_quantity_stock
        this.p_sellprice = product.product_sell_price;
        this.p_description = product.product_description;
        this.brandID = product.p_supplier_id;
        this.name = product.product_image;
        this.p_brandName = product.supplier_name
      }
    })
  }

  updateProduct(){
    const obj = {
      product_id: this.productId,
      product_name: this.p_name,
      product_quantity: this.p_quantity,
      product_originalPrice: this.p_originalprice,
      product_sellPrice: this.p_sellprice,
      product_description: this.p_description,
      product_status: this.p_status
    }

    this.apiProduct.updateProduct(obj, this.brandID, this.name)
    .subscribe(data => {
      this.toast.success(data.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
      this.router.navigate(['View-Product']);
    },
    error => {
      this.toast.error(error.error.message, 'Error: Data is missing!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helper/ValidateForm';
import { ApiBrandService } from 'src/app/services/api-brand.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{
  public lstBrand : any = [];

  productForm!:FormGroup;
  selectBrand : string = '';
  brandID:number = 0;
  selectedFiles!: File;
  imageUrl: File[] = [];
  path:any;
  image:any;
  name:string = '';

  token = '';
  lstFileName: string[] = [];
  listFile!:File;

  constructor(
    private apiBrand:ApiBrandService,
    private fb:FormBuilder,
    private toast:ToastrService,
    private apiProduct:ApiProductService,
    private api:ApiService,
    private router:Router,
  ){}

  ngOnInit(): void {
    this.apiBrand.getAllBrand().subscribe(data => {
      this.lstBrand = data;
    })

    this.productForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.pattern('.{2,50}')]],
      product_quantity: ['', [Validators.required,Validators.min(1),Validators.max(1000), Validators.pattern('[0-9]+')]],
      product_originalPrice: ['',[Validators.required,Validators.min(10),Validators.max(10000), Validators.pattern('[0-9]+')]],
      product_sellPrice: ['',[Validators.required,Validators.min(10),Validators.max(10000), Validators.pattern('[0-9]+')]],
      product_description: ['',Validators.required],
      product_brand: ['', Validators.required],
    })

    this.token = JSON.stringify(this.api.getToken());
  }

  uploadImage(event:any){
    // var file = event.target.files[0];
    // const formData:FormData = new FormData();
    // formData.append('uploadedFile', file, file.name)

    // this.apiProduct.uploadImage(formData).subscribe((data:any) => {
    //   this.name = data.toString();
    //   this.image = data.toString();
    //   this.path = this.apiProduct.PhotoUrl + "/" + this.image;
    // })

    const listFile: FileList | null = event.target.files;
    this.imageUrl = [];

    if(listFile && listFile.length > 0){
      for(let i = 0; i < listFile.length; i++){
        this.imageUrl.push(listFile.item(i)!);

        this.listFile = event.target.files[i];
        const formData:FormData = new FormData();
        formData.append('uploadedFile', this.listFile, this.listFile.name);

        this.apiProduct.uploadImage(formData).subscribe((data:any) => {
          this.name = data.toString();
          this.image = data.toString();
          this.path = this.apiProduct.PhotoUrl + "/" + this.image;
        });
      }
    }

    this.imageUrl.forEach((file: File) => {
      this.lstFileName.push(file.name);
    });
  }

  onSelectBrand(event:any):void{
    this.selectBrand = event.target.value;
    this.apiBrand.getId(this.selectBrand).subscribe(data => {
      this.brandID = data;
      console.log(this.brandID);
    })
  }

  addProduct(){
    if(this.productForm.valid){
      if(this.imageUrl.length != 0){
        const productObj = {
          product_name: this.productForm.get('product_name')?.value,
          product_quantity_stock: this.productForm.get('product_quantity')?.value,
          product_original_price: this.productForm.get('product_originalPrice')?.value,
          product_sell_price: this.productForm.get('product_sellPrice')?.value,
          product_description: this.productForm.get('product_description')?.value,
          p_brand_id: this.brandID,
          product_image: this.name,
          product_status: "Yes",
        }
        
        let imageList = this.lstFileName.map((option: any) => ({ uri: option}));

        this.apiProduct.addProduct(productObj, imageList).subscribe(data =>{
          this.toast.success(data.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
        });
        this.productForm.reset();
        this.router.navigate(['View-Product']);
      }
      else{
        this.toast.warning("Please, upload product's image", 'Warning!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      }
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.productForm);
      this.toast.warning("Please, enter the required fields to add product", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }

  }
}

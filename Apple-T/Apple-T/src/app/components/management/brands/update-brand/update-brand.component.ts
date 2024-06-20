import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiBrandService } from 'src/app/services/api-brand.service';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.css']
})
export class UpdateBrandComponent implements OnInit{
  public lstBrand : any = [];

  brandId:number = 0;

  b_name:string = '';
  b_email:string = '';
  b_address:string = '';
  b_phone:string = '';
  b_status:string = '';

  constructor(
    private apiBrand:ApiBrandService,
    private toast:ToastrService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
  ){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.brandId = +params['id'];
      this.getBrand(this.brandId);
    })
  }

  nameChange(event:any){
    this.b_name = event.target.value;
  }

  emailChange(event:any){
    this.b_email = event.target.value;
  }

  addressChange(event:any){
    this.b_address = event.target.value;
  }

  phoneChange(event:any){
    this.b_phone = event.target.value;
  }

  onSelectStatus(event:any){
    this.b_status = event.target.value;
  }

  getBrand(id:any){
    this.apiBrand.getBrandById(id).subscribe(data => {
      this.lstBrand = data;

      this.b_name = this.lstBrand.brand_name;
      this.b_email = this.lstBrand.brand_email;
      this.b_address = this.lstBrand.brand_address;
      this.b_phone = this.lstBrand.brand_phone;
      this.b_status = this.lstBrand.brand_status;
    })
  }

  updateBrand(){
    const obj = {
      brand_id: this.brandId,
      brand_name: this.b_name,
      brand_email: this.b_email,
      brand_address: this.b_address,
      brand_phone: this.b_phone,
      brand_status: this.b_status
    }

    this.apiBrand.updateBrand(obj).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
      this.router.navigate(['View-Brand']);
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

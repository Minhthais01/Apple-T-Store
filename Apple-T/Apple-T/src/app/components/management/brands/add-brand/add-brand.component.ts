import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helper/ValidateForm';
import { ApiBrandService } from 'src/app/services/api-brand.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})
export class AddBrandComponent implements OnInit{
  brandForm!: FormGroup

  constructor(
    private router:Router,
    private apiBrand:ApiBrandService,
    private fb:FormBuilder,
    private toast:ToastrService,
  ){}

  ngOnInit(): void {
    this.brandForm = this.fb.group({
      brand_name: ['', [Validators.required, Validators.pattern('.{2,20}')]],
      brand_email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      brand_address: ['', Validators.required],
      brand_phone: ['', [Validators.required, Validators.pattern('^[0]\\d{9}$')]],
      brand_status: ['', Validators.required]
    })
  }

  callTest(): void {
    this.apiBrand.triggerLoad();
  }

  addbrand(){
    if(this.brandForm.valid){
      this.apiBrand.addBrand(this.brandForm.value).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
        this.callTest();
        this.router.navigate(['View-Brand']); 
        // location.reload();
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
      ValidateForm.ValidateAllFormFileds(this.brandForm);
      this.toast.warning("Please, enter all required fields to add brand", 'Warning', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  }
}

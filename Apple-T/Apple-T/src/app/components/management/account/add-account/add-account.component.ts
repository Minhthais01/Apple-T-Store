import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helper/ValidateForm';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  addAccountForm!: FormGroup

  constructor(
    private api:ApiService,
    private fb:FormBuilder,
    private router:Router,
    private toast:ToastrService
  ){}

  ngOnInit(): void {
    this.addAccountForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('.{2,10}')]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0]\\d{9}$')]],
      address: [''],
      role: ['',Validators.required]
    })
  }

  onSignup(){
    console.log(this.addAccountForm.value);
    if(this.addAccountForm.valid){
      this.api.signup(this.addAccountForm.value).subscribe(res => {
        this.toast.success('Create Account Success', 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
        this.addAccountForm.reset();
        this.router.navigate(['View-Account']);
      },
      error => {
        this.toast.error(error.error.message, 'Error!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      })
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.addAccountForm);
      this.toast.warning("Please, enter the required fields to create", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    }
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
}

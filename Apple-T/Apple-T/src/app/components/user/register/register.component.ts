import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helper/ValidateForm';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  registerForm!: FormGroup
  isChecked: boolean = true;

  constructor(
    private api:ApiService,
    private fb:FormBuilder,
    private router:Router,
    private toast:ToastrService
  ){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('.{2,20}')]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0]\\d{9}$')]],
      address: [''],
      role: ['Customer']
    })
  }

  onSignup(){
    // console.log(this.registerForm.value);
    if(this.registerForm.valid){
      this.api.signup(this.registerForm.value).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
        this.registerForm.reset();
        this.router.navigate(['Login']);
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
      ValidateForm.ValidateAllFormFileds(this.registerForm);
      this.toast.warning("Please, enter the required fields to register", 'Warning!', {
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

  // checkbox
  toggleButton() {
    // Toggle button's disabled state based on checkbox state
    this.isChecked = !this.isChecked
    this.isChecked ? this.enableButton() : this.disableButton() ;
  }

  disableButton() {
    // Disable the button
    const button = document.getElementById('btn-Register') as HTMLButtonElement;
    button.disabled = true;
  }

  enableButton() {
    // Enable the button
    const button = document.getElementById('btn-Register') as HTMLButtonElement;
    button.disabled = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import ValidateForm from 'src/app/helper/ValidateForm';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
// import { ResetPassword } from 'src/app/Models/reset-password.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  show: string = "none";
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  checkAccount : string = "block";

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router:Router,
    private userStore: UserStoreService,
    private toast:ToastrService,
    private resetapi: ResetPasswordService
  ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(){
    if(this.loginForm.valid){
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.api.login(username, password).subscribe(res => {
        this.loginForm.reset();
        this.api.storeToken(res.accessToken);

        this.api.storeRefreshToken(res.refreshToken);

        const tokenPayload = this.api.decodedToken();
        this.userStore.setFullNameForStore(tokenPayload.unique_name);
        this.userStore.setRoleForStore(tokenPayload.role);

        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });

        this.router.navigate(['']);
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
      //throw the error using toaster and with required fields
      ValidateForm.ValidateAllFormFileds(this.loginForm);
      this.toast.warning("Please, enter all fields to login", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    }
  }

  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w]{2,3}$/;
    this.isValidEmail = pattern.test(value);

    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      // console.log(this.resetPasswordEmail);

      this.resetapi.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
        next:(res)=>{
          this.toast.success(res.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById("btnClose");
          buttonRef?.click();
        },
        error:(err)=>{
          this.toast.error(err.error.message, 'Error!', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
        }
      })
    }
  }
 
}

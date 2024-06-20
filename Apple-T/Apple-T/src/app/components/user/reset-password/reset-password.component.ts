import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPassword } from 'src/app/Models/reset-password.model';
import ValidateForm from 'src/app/helper/ValidateForm';
import { confirmPasswordValidator } from 'src/app/helper/confirm-password.validator';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm !: FormGroup
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  emailToReset!:string;
  emailToken!:string;
  resetPasswordObj = new ResetPassword();

  constructor
  (
    private fb:FormBuilder,
    private activatedRoute : ActivatedRoute,
    private resetapi : ResetPasswordService,
    private router : Router,
    private toast:ToastrService
  ){}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },{
      validator: confirmPasswordValidator("password", "confirmPassword")
    });

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToReset);
      console.log(this.emailToken);

    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  reset(){
    if(this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetapi.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
          // console.log("Password reset successfully!");
          // alert(res.message);
          this.toast.success(res.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
          this.router.navigate(['login']);
        },
        error:(err)=>{
          // console.log("Password reset is not success!");
          // alert(err.error.message);
          this.toast.error(err.error.message, 'Error!', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
        }
      })
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.resetPasswordForm);
      this.toast.warning("Please, enter all fields to renew password", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  public fullname:string = "";
  public role:string = "";
  public account: any = [];

  name : string = '';
  email : string = '';
  address : string = '';
  phone : string = '';
  birthday : string = '';
  gender : string = '';
  password :string = "";

  user_id : number = 0;

  path : any;
  image : any;
  uri:string = '';
  file!: File;
  account_role : string = "";


  constructor(
    private api:ApiService,
    private userStore:UserStoreService,
    private route:Router,
    private toast:ToastrService
  ){}

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    })
    this.path = this.api.PhotoUrl + "/";

    this.api.getUserId(this.fullname).subscribe(data => {
      this.user_id = data;
    })

    this.api.getUserByName(this.fullname).subscribe(data => {
      this.account = data;

      for(const account of this.account){
        this.name = account.account_username;
        this.email = account.account_email;
        this.birthday = account.account_birthday;
        this.address = account.account_address;
        this.phone = account.account_phone
        this.gender = account.account_gender;
        this.uri = account.account_avatar;
        this.password = account.account_password;
        this.account_role = account.role;
      }

      console.log("account", this.account);
    });

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    })

    this.userStore.setRoleForStore(this.role);
  }

  nameChange(event:any){
    this.name = event.target.value;
  }

  emailChange(event:any){
    this.email = event.target.value;
  }

  phoneChange(event:any){
    this.phone = event.target.value;
  }

  addressChange(event:any){
    this.address = event.target.value;
  }

  birthdayChange(event:any){
    this.birthday = event.target.value;
  }

  male(event:any){
    this.gender = event.target.value;
  }

  female(event:any){
    this.gender = event.target.value;
  }

  prefer(event:any){
    this.gender = event.target.value;
  }

  uploadImage(event:any){
    const file: FileList | null = event.target.files;

    if(file && file.length > 0){
      this.file = event.target.files[0];
      const formData:FormData = new FormData();
      formData.append('uploadedFile', this.file, this.file.name);
      
      this.api.uploadImage(formData).subscribe((data:any) => {
        this.uri = data.toString();
        this.image = data.toString();
        this.path = this.api.PhotoUrl + "/" + this.image;
      });
    }
  }

  saveChange(){
    const obj = {
      account_id : this.user_id,
      account_username : this.name,
      account_email : this.email,
      account_phone : this.phone,
      account_address : this.address,
      account_birthday : this.birthday,
      account_gender : this.gender,
      account_password : this.password,
      account_avatar : this.uri,
      role : this.account_role
    }

    console.log("obj",obj);

    this.api.updateProfile(obj).subscribe(res => {
      this.api.storeToken(res.accessToken);
      this.api.storeRefreshToken(res.refreshToken);

      const load = this.api.decodedToken();
      this.userStore.setFullNameForStore(load.unique_name);
      this.userStore.setRoleForStore(load.role);

      console.log("load", load);

      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      // this.route.navigate(["/profile"]);;
      this.ngOnInit();
      // window.location.reload();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    });
  }

}

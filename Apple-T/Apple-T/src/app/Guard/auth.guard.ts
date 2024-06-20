import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStoreService } from '../services/user-store.service';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate{
  adminRole:string = '';
  lstAccount:any=[];

  constructor(
    private api:ApiService,
    private router:Router,
    private toast:ToastrService,
    private userStore: UserStoreService
  ){}

  canActivate():boolean{
    this.userStore.getRoleFromStore().subscribe(data =>{
      let roleFromToken = this.api.getRoleFromToken();
      this.adminRole = data || roleFromToken;
    })

    this.api.getAllAccount().subscribe(data => {
      this.lstAccount = data;
    })

    if(this.api.isLoggedIn() && this.adminRole == "Admin"){
      return true;
    }
    else{
      this.toast.warning("Please login first", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
      this.router.navigate(['login']);
      return false;
    }
  }

}

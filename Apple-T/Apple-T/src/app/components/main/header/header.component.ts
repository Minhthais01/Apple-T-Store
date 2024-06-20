import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiBrandService } from 'src/app/services/api-brand.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  public fullname:string = "";
  public role:string = "";
  public n : string = "none";
  public m : string = "block";
  public lstBrand : any = [];
  public brandKey : string = "";
  public lstCategory : any = [];
  public lstProduct : any = [];
  private subscription!: Subscription;
  display:boolean = true;

  path : any;

  key:string = '';

  constructor(
    
    private api:ApiService,
    private userStore:UserStoreService,
    private route:Router,
    private toast:ToastrService,
    private apiBrand:ApiBrandService,
    private activatedRouter: ActivatedRoute,
    private apiProduct : ApiProductService,
  ){
    this.subscription = this.apiBrand.testFunctionTriggered$.subscribe(() => {
    this.viewAllBrand();
  });}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.brandKey = params['brandKey'];
      this.path = this.apiProduct.PhotoUrl + "/";
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    })

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;

      if(this.role != undefined){
        this.m = "none";
        this.n = "block";
      }
    })

    this.viewAllBrand();

    this.userStore.setRoleForStore(this.role);
  }

  viewAllBrand(){
    this.apiBrand.getAllBrand().subscribe(data => {
      this.lstBrand = data;
    })
  }

  Logout(){
    this.api.signOut();
    this.n = "none";
    this.m = "block";
    this.role = "";
    this.fullname = "";
    this.userStore.setRoleForStore(this.role);
    this.callTest();
  }

  showDropdown(){
    this.display =! this.display;
  }

  searchKey(event:any){
    this.key = event.target.value;
  }

  showProductBrand( brand_name : string){
    this.route.navigate(['/Product-Search-Brand', brand_name]);
  }

  search(){
    if(this.key != ''){
      this.route.navigate(['/Product-Search', this.key]);
    }else{
      this.toast.warning("No data to search!", 'Warning', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  callTest(): void {
    this.apiBrand.triggerLoad();
  }
}

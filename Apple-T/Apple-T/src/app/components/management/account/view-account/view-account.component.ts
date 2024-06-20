import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.css']
})
export class ViewAccountComponent implements OnInit{
  lstAccount : any = [];
  searchTerm : string = '';
  pageSize = 6;
  currentPage = 1;

  constructor(
    private api:ApiService,
    private toast:ToastrService,
    private shareService: ShareService
  ){}


  ngOnInit(): void {
    this.getAllAccount();
  }

  viewAllAccount(){
    this.api.getAllAccount().subscribe(data => {
      this.lstAccount = data;
    })
  }

  toggleSearchButton(): void {
    if (this.searchTerm.trim() === '') {
      this.viewAllAccount();
    }
  }

  getAllAccount(){
    this.api.getAllAccount().subscribe(data => {
      this.lstAccount = data;
    })
  }

  callTest(): void {
    this.shareService.triggerLoad();
  }

  banAccount(id:any){
    this.api.banAccount(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.getAllAccount();
      this.callTest();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  unbanAccount(id:any){
    this.api.unbanAccount(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.getAllAccount();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  search(){
    this.api.search(this.searchTerm).subscribe(data => {
      this.lstAccount = data;
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

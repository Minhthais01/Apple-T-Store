import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiBrandService } from 'src/app/services/api-brand.service';

@Component({
  selector: 'app-view-brand',
  templateUrl: './view-brand.component.html',
  styleUrls: ['./view-brand.component.css']
})
export class ViewBrandComponent implements OnInit{
  public lstBrand : any = [];
  searchTerm : string = '';
  pageSize = 6;
  currentPage = 1;

  constructor(
    private apiBrand:ApiBrandService,
    private toast:ToastrService,
  ){}

  ngOnInit(): void {
   this.viewAllBrand();
  }

  viewAllBrand(){
    this.apiBrand.getAllBrand().subscribe(data => {
      this.lstBrand = data;
    })
  }

  toggleSearchButton(): void {
    if (this.searchTerm.trim() === '') {
      this.viewAllBrand();
    }
  }

  search(){
    this.apiBrand.search(this.searchTerm).subscribe(data => {
      this.lstBrand = data;
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  id:any

  getId(id:any){
    this.id = id;
  }

  deleteBrand(){
      this.apiBrand.deleteBrand(this.id).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });

        this.viewAllBrand();
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

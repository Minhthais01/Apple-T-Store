import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiProductService } from 'src/app/services/api-product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit{
  public lstProduct:any = [];
  path:any;
  searchTerm : string = '';
  pageSize = 6;
  currentPage = 1;

  constructor(
    private apiProduct:ApiProductService,
    private toast:ToastrService,
    private router:Router
  ){}

  ngOnInit(): void {
   this.viewAllProduct();
  }

  viewAllProduct(){
    this.apiProduct.getAllProduct().subscribe(data => {
      this.lstProduct = data;
      this.path = this.apiProduct.PhotoUrl + "/";
    })
  }

  toggleSearchButton(){
    if(this.searchTerm.trim() === ''){
      this.viewAllProduct();
    }
  }

  search(){
    this.apiProduct.search(this.searchTerm).subscribe(data => {
      this.lstProduct = data;
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

  deleteProduct(){
    
      this.apiProduct.deleteProduct(this.id).subscribe(data => {
        this.toast.success(data.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });

        this.ngOnInit();
      },
      error => {
        this.toast.error(error.error.message, 'Error!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      })
  }
}

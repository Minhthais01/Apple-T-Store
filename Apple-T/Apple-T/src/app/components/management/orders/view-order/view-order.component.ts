import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiOrderService } from 'src/app/services/api-order.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit{
  public lstOrder : any = [];
  searchTerm : string = '';
  pageSize = 6;
  currentPage = 1;

  constructor(
    private apiOrder:ApiOrderService,
    private toast:ToastrService,
  ){}

  ngOnInit(): void {
    this.viewAllOrder();
  }

  viewAllOrder(){
    this.apiOrder.getAllOrder().subscribe((data) => {
      this.lstOrder = data;
    })
  }

  toggleSearchButton(){
    if(this.searchTerm.trim() === ''){
      this.viewAllOrder();
    }
  }

  search(){
    this.apiOrder.search(this.searchTerm).subscribe(data => {
      this.lstOrder = data;
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    });
  }

  confirmOrder(id:number){
    this.apiOrder.confirmOrder(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.viewAllOrder();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  Cancel(id:number){
    this.apiOrder.cancelOrder(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      })

      this.ngOnInit();
    });
  }
}

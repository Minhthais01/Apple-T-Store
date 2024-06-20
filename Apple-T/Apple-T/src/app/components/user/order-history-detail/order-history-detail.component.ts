import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiOrderService } from 'src/app/services/api-order.service';
import { ApiProductService } from 'src/app/services/api-product.service';

@Component({
  selector: 'app-order-history-detail',
  templateUrl: './order-history-detail.component.html',
  styleUrls: ['./order-history-detail.component.css']
})
export class OrderHistoryDetailComponent implements OnInit{
  public lstOrderDetail : any = [];
  orderId : number = 0;
  path : string = '';

  pageSize = 6;
  currentPage = 1;

  constructor(
    private apiOrder:ApiOrderService,
    private toast:ToastrService,
    private activatedRouter:ActivatedRoute,
    private apiProduct: ApiProductService
  ){}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.orderId = +params['id'];
      this.viewAllOrder(this.orderId);
      this.path = this.apiProduct.PhotoUrl + "/";
    });
  }

  viewAllOrder(id:number){
    this.apiOrder.getOrderDetail(id).subscribe((data) => {
      this.lstOrderDetail = data;
    })
  }
}

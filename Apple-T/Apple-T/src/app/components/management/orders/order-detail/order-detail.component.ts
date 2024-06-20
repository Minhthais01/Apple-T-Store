import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiOrderService } from 'src/app/services/api-order.service';
import { ApiProductService } from 'src/app/services/api-product.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit{
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

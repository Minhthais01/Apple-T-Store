import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiOrderService } from 'src/app/services/api-order.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
  public lstOrder : any = [];
  searchTerm : string = '';
  fullname : string = "";
  path : string = '';
  pageSize = 6;
  currentPage = 1;

  constructor(
    private orderAPI : ApiOrderService,
    private userStore : UserStoreService,
    private api : ApiService,
    private apiProduct: ApiProductService,
    private toast:ToastrService,
  ){}

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(data => {
      let fullnameFromToken = this.api.getFullNameFormToken();
      this.fullname = data || fullnameFromToken;
      this.getOrderHistory(this.fullname);
      // this.path = this.apiProduct.PhotoUrl + "/";
    });
  }

  getOrderHistory(username:string){
    this.orderAPI.getOrderHistory(username).subscribe(data => {
      this.lstOrder = data;
    });
  }

  toggleSearchButton(){
    if(this.searchTerm.trim() === ''){
      // this.viewAllProduct();
    }
  }

  Cancel(id:number){
    this.orderAPI.Cus_cancelOrder(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      })

      this.ngOnInit();
    });
  }

  search(){
    this.orderAPI.search(this.searchTerm).subscribe(data => {
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

search_OrderHistory() {
  if (this.searchTerm.trim() !== '') {
      // Gọi phương thức search_OrderHistory từ service để tìm kiếm theo trạng thái đơn hàng
      this.orderAPI.search_OrderHistory(this.fullname, this.searchTerm).subscribe(
          data => {
              this.lstOrder = data;
          },
          error => {
              this.toast.error(error.error.message, 'Error', {
                  timeOut: 3000,
                  progressBar: true,
                  positionClass: 'toast-top-center'
              });
          }
      );
  } else {
      // Nếu ô tìm kiếm trống, hiển thị tất cả các đơn hàng
      this.getOrderHistory(this.fullname);
  }
}

// search_OrderHistory(){
//   this.orderAPI.search_OrderHistory(this.searchTerm).subscribe(data => {
//     this.lstOrder = data;

//   },
//   error => {
//     this.toast.error(error.error.message, 'Error', {
//       timeOut: 3000,
//       progressBar: true,
//       positionClass: 'toast-top-center'
//     });
//   });
// }
}

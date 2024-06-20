import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiOrderService {
  private Order_API = 'http://localhost:5176/api/Order/';
  private OrderDetail_API = 'http://localhost:5176/api/OrderDetail/';

  constructor(private http:HttpClient) { }

  addOrder(CartObj:any, OrderObj:any){
    const body = {
      cart: CartObj,
      order: OrderObj
    };

    return this.http.post<any>(`${this.Order_API}`, body);
  }

  getAllOrder() : Observable<any>{
    return this.http.get<any>(this.Order_API);
  }

  getOrderDetail(id:number) : Observable<any>{
    return this.http.get<any>(`${this.OrderDetail_API}view_detail?id=${id}`);
  }


  confirmOrder(id:number){
    const params = new HttpParams()
    .set('id', id)
    return this.http.put<any>(`${this.Order_API}ConfirmOrder`,{}, {params})
  }

  cancelOrder(id:number){
    const params = new HttpParams()
    .set('id', id)
    return this.http.put<any>(`${this.Order_API}CancelOrder`,{}, {params})
  }

  Cus_cancelOrder(id:number){
    const params = new HttpParams()
    .set('id', id)
    return this.http.put<any>(`${this.Order_API}Cus_CancelOrder`,{}, {params})
  }

  search(key:any) : Observable<any>{
    return this.http.get<any>(`${this.Order_API}search?key=${key}`);
  }

  // search_OrderHistory(key:any) : Observable<any>{
  //   return this.http.get<any>(`${this.Order_API}search_OrderHistory?key=${key}`);
  // }


  search_OrderHistory(username: string, key: string): Observable<any> {
    const params = new HttpParams()
        .set('username', username)
        .set('key', key);

    return this.http.get<any>(`${this.Order_API}search_OrderHistory`, { params });
}

  getOrderHistory(username:string) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.Order_API}get_order_history?username=${username}`, {headers});
  }
}

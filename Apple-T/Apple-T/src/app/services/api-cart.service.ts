import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCartService {

  private baseURL = 'http://localhost:5176/api/CartDetail/';

  constructor(private http:HttpClient) { }

  addCart(obj:any){
    return this.http.post<any>(this.baseURL, obj);
  }

  getCart(id:any) : Observable<any>{
    const params = new HttpParams()
    .set('id', id);

    return this.http.get<any>(`${this.baseURL}GetCart`, {params});
  }

  deleteCart(id:any){
    return this.http.delete<any>(this.baseURL + id);
  }

  plusQty(id:any){
    const params = new HttpParams()
    .set('id', id);

    return this.http.put<any>(`${this.baseURL}plusQty`, {}, {params});
  }

  minusQty(id:any){
    const params = new HttpParams()
    .set('id', id);

    return this.http.put<any>(`${this.baseURL}minusQty`, {}, {params});
  }
}

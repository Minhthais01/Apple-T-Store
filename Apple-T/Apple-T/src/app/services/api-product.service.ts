import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiProductService {
  private baseURL = 'http://localhost:5176/api/Product/';
  PhotoUrl = "http://localhost:5176/Images";

  constructor(
    private http:HttpClient,
    private router:Router,
  ) { }


  getAllProduct() : Observable<any>{
    return this.http.get<any>(this.baseURL);
  }

  getAllProductWithStatusYes() : Observable<any>{
    return this.http.get<any>(`${this.baseURL}GetProductWithStatus`);
  }

  getProductById(proId:number) : Observable<any>{
    return this.http.get<any>(this.baseURL + proId);
  }

  addProduct(productObj:any, imageObj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = {
      Product: productObj,
      Image: imageObj
    };

    return this.http.post<any>(`${this.baseURL}`, body, {headers});
  }

  updateProduct(obj:any, bId:any, img:any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({
      product_id: obj.product_id,
      product_name: obj.product_name,
      product_quantity_stock: obj.product_quantity,
      product_original_price: obj.product_originalPrice,
      product_sell_price: obj.product_sellPrice,
      product_description: obj.product_description,
      product_status: obj.product_status,
      p_brand_id: bId,
      product_image: img
    });

    return this.http.put<any>(`${this.baseURL}`, body, {headers});
  }

  deleteProduct(id:any){
    return this.http.delete<any>(this.baseURL + id);
  }

  uploadImage(file:any){
    return this.http.post<any>(`${this.baseURL}uploadImage`, file);
  }

  getImage():Observable<any>{
    return this.http.get<any>(`${this.baseURL}getImage`);
  }

  search(key:any):Observable<any>{
    return this.http.get<any>(`${this.baseURL}search?key=${key}`);
  }
}

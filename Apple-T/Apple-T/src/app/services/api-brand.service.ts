import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiBrandService {
  private baseURL = 'http://localhost:5176/api/Brand/';

  constructor(private http:HttpClient) { }

  getAllBrand() :Observable<any>{
    return this.http.get<any>(this.baseURL + "get_brand");
  }

  getId(name:string) : Observable<any>{
    const params = new HttpParams()
    .set('brand_name', name);

    return this.http.get<any>(`${this.baseURL}brand_name`, {params});
  }

  getBrandById(id:any) : Observable<any>{
    return this.http.get<any>(this.baseURL + id);
  }

  addBrand(obj:any){
    return this.http.post<any>(`${this.baseURL}add_brand`, obj);
  }

  updateBrand(obj:any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({
      brand_id: obj.brand_id,
      brand_name: obj.brand_name,
      brand_email: obj.brand_email,
      brand_address: obj.brand_address,
      brand_phone: obj.brand_phone,
      brand_status: obj.brand_status
    });

    return this.http.put<any>(`${this.baseURL}`, body, {headers});
  }

  deleteBrand(id:any){
    return this.http.delete<any>(this.baseURL + id);
  }

  search(key:any) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}search?key=${key}`);
  }
  getProductByBrand(brandKey:any) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}FindProductByBrand?brandKey=${brandKey}`);
  }

  
  private triggerTestFunction = new Subject<void>();

  testFunctionTriggered$ = this.triggerTestFunction.asObservable();

  triggerLoad(): void {
    this.triggerTestFunction.next();
  }
}

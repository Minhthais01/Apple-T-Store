import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiImageService {
  private baseURL = 'http://localhost:5176/api/Image/';

  constructor(private http:HttpClient) { }

  GetImageByProId(pro_id:number) : Observable<any>{
    return this.http.get<any>(this.baseURL + pro_id);
  }

  deleteImage(id:number){
    return this.http.delete<any>(this.baseURL + id);
  }
}

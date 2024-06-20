import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseURL = 'http://localhost:5176/api/Statistics/';
  
  constructor(private http:HttpClient) { }

  getPro_Statistics(sortOrder: string) :Observable<any>{
    return this.http.get<any>(`${this.baseURL}statistic_product?sortOrder=${sortOrder}`);
  }

  getPro_Statistics_Chart() :Observable<any>{
    return this.http.get<any>(`${this.baseURL}statistic_product_chart`);
  }

  getTotal_Statistic():Observable<any>{
    return this.http.get<any>(`${this.baseURL}statistic_total`);
  }

  getStatistics(fromDate: string, toDate: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}statistic_product_byMonth?fromDate=${fromDate}&toDate=${toDate}`);
  }

  getStatistics_byMonth(fromDate: string, toDate: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}statistic_total_byMonth?fromDate=${fromDate}&toDate=${toDate}`);
  }
}

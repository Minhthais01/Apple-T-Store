import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../Models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseURL = "http://localhost:5176/api/Account/";
  PhotoUrl = "http://localhost:5176/Images";
  private userPayLoad:any;

  constructor(private http:HttpClient, private router:Router)
  {
    this.userPayLoad = this.decodedToken();
  }

  getUserId(username:string) : Observable<any>{
    const params = new HttpParams()
    .set('username', username);

    return this.http.get<any>(`${this.baseURL}username`, {params});
  }

  getUserByName(user:string) : Observable<any>{
    const params = new HttpParams()
    .set('user', user);

    return this.http.get<any>(`${this.baseURL}user`, {params});
  }

  uploadImage(file:any){
    return this.http.post<any>(`${this.baseURL}uploadImage`, file);
  }

  updateProfile(obj:any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({
      account_id : obj.account_id,
      account_username : obj.account_username,
      account_email : obj.account_email,
      account_phone : obj.account_phone,
      account_address : obj.account_address,
      account_birthday : obj.account_birthday,
      account_avatar : obj.account_avatar,
      account_password : obj.account_password,
      account_confirm_password: obj.account_password,
      account_gender : obj.account_gender,
      role : obj.role
    });

    return this.http.put<any>(`${this.baseURL}UpdateProfile`, body, {headers});
  }

  banAccount(id:any){
    const params = new HttpParams()
    .set('id', id);

    return this.http.put<any>(`${this.baseURL}BanAccount`,{}, {params});
  }

  unbanAccount(id:any){
    return this.http.put<any>(`${this.baseURL}${id}`, null);
  }

  login(username:string, password:string): Observable<any>{
    const params = new HttpParams()
    .set('username', username)
    .set('password', password);

    return this.http.post<any>(`${this.baseURL}Login`, {},{params});
  }

  signup(account:any) : Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({
      account_username: account.username,
      account_email: account.email,
      account_password: account.password,
      account_confirm_password: account.confirmPassword,
      account_birthday: account.birthday,
      account_phone: account.phone,
      account_address: account.address,
      account_gender: account.gender,
      role: account.role
    });

    console.log(body);

    return this.http.post<any>(`${this.baseURL}Register`, body, {headers});
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['Login']);
  }


  storeToken(tokenValue:string){
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  decodedToken(){
    const jwt = new JwtHelperService();
    const token = this.getToken()!;

    console.log(jwt.decodeToken(token));

    return jwt.decodeToken(token);
  }

  getAllAccount(): Observable<any>{
    return this.http.get<any>(this.baseURL);
  }

  getFullNameFormToken(){
    if(this.userPayLoad){
      return this.userPayLoad.unique_name;
    }
  }

  getRoleFromToken(){
    if(this.userPayLoad){
      return this.userPayLoad.role;
    }
  }

  renewToken(tokenApi:TokenApiModel){
    return this.http.post<any>(`${this.baseURL}refresh`, tokenApi);
  }

  CheckOldPass(username: string, password: string) {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.put<any>(
      `${this.baseURL}check-old-password`,
      {},
      { params }
    );
  }

  ChangePass(password: string, confirmpassword: string, username: string) {
    const params = new HttpParams()
      .set('newPass', password)
      .set('conPass', confirmpassword)
      .set('username', username);

    return this.http.put<any>(`${this.baseURL}ChangePassword`, {}, { params });
  }

  search(key:any) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}search?key=${key}`);
  }
}

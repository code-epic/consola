import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface IMenu{
  id ?: string
  esta ?: string
  nomb ?: string
}

@Injectable({
  providedIn: 'root'
})


export class MenuService {
  URL =  '/v1/api/';

  

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem('token') })
  };
  constructor(private http : HttpClient) {
   
  }


  
  Listar(menu : IMenu) : Observable<any>{
    var url = this.URL + 'crud';
    return this.http.post<any>(url, menu, this.httpOptions );
  }




}

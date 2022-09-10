import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Customer} from "../models/customer";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiServerUrl=environment.apiBaseUrl;


  constructor(private http:HttpClient) { }

  saveCustomer(customer:Customer):Observable<Customer>{
    return this.http.post<Customer>(`${this.apiServerUrl}/rest/customer/api/addCustomer`,customer);
  }

  updateCustomer(customer:Customer):Observable<Customer>{
    return this.http.put<Customer>(`${this.apiServerUrl}/rest/customer/api/updateCustomer`,customer);
  }

  deleteCustomer(customer:Customer):Observable<string>{
    return this.http.delete<string>(`${this.apiServerUrl}/rest/customer/api/deleteCustomer/`+customer.id);
  }

  searchCustomerByEmail(email:string):Observable<Customer>{
    return this.http.get<Customer>(`${this.apiServerUrl}/rest/customer/api/searchByEmail?email=`+email);
  }

  searchCustomerByLastName(lastName:string):Observable<Customer[]>{
    return this.http.get<Customer[]>(`${this.apiServerUrl}/rest/customer/api/searchByLastName?lastName=`+lastName);
  }


}

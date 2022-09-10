import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SimpleLoan} from "../models/simple-loan";
import {map, Observable} from "rxjs";
import {Loan} from "../models/loan";
import {Mail} from "../models/mail";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiServerUrl=environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  saveLoan(simpleLoan:SimpleLoan):Observable<Loan>{
    return this.http.post<Loan>(`${this.apiServerUrl}/rest/loan/api/addLoan`,simpleLoan);
  }

  closeLoan(simpleLoan:SimpleLoan):Observable<Boolean>{
    return this.http.post<Boolean>(`${this.apiServerUrl}/rest/loan/api/closeLoan`, simpleLoan);
  }

  searchLoanByEmail(email:string):Observable<Loan[]>{
    return this.http.get<Loan[]>(`${this.apiServerUrl}/rest/loan/api/customerLoans?email=`+email);
  }


  searchLoanByMaxDate(maxDate:Date):Observable<Loan[]>{
    let month : string = maxDate.getMonth()<9 ? '0'+(maxDate.getMonth()+1) : ''+(maxDate.getMonth());
    let dayOfMonth : string = maxDate.getDate() < 10 ? '0'+maxDate.getDate(): ''+maxDate.getDate();
    let maxDateStr :string = maxDate.getFullYear() + '-' + month + '-' +dayOfMonth;
    console.log('maxDateStr :',maxDateStr)
    console.log('dayOfMonth :',maxDate.getDate())
    return this.http.get<Loan[]>( `${this.apiServerUrl}/rest/loan/api/maxEndDate?date=`+maxDateStr);
  }


  sendEmail(mail: Mail): Observable<boolean>{
    //let headers = new HttpHeaders();
    //headers.append('responseType', 'arraybuffer'); , {headers: headers}
    return this.http.put<boolean>(`${this.apiServerUrl}/rest/customer/api/sendEmailToCustomer`, mail);
  }

  allLoans():Observable<Loan[]>{
    return this.http.get<Loan[]>( `${this.apiServerUrl}/rest/loan/api/allLoans`).pipe(
      map(responseData=>{
        const LoansArray : Loan[] = [];
        for (const key in responseData){
          LoansArray.push({...responseData[key]})
        }
        console.log('LoansArray :',LoansArray)
        return LoansArray;
      })
    );
  }


}

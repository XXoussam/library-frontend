import { Component, OnInit } from '@angular/core';
import {SimpleLoan} from "../models/simple-loan";
import {Loan} from "../models/loan";
import {LoanService} from "../service/loan.service";
import {BookService} from "../service/book.service";
import {CustomerService} from "../service/customer.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {NgForm} from "@angular/forms";
import {Book} from "../models/book";
import {Customer} from "../models/customer";
import {forkJoin, interval, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Mail} from "../models/mail";
import {__assign} from "tslib";


@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  public types = [ 'Email', 'Maximum date'];
  public email!: string;
  public maxDate!: Date;
  public displayType: string = 'Email'
  public headsTab = ['ISBN', 'TITLE', 'EMAIL', 'LAST NAME', 'BEGIN DATE', 'END DATE'];
  public isNoResult: boolean = true;
  public isFormSubmitted: boolean = false;
  public actionButton: string = 'Save';
  public titleSaveOrUpdate: string = 'Add New Loan Form';
  public customerId!: number;
  public isDisplaySendEmailForm: boolean = false;
  public disabledBackground : boolean = false;
  public messageModal!: string;
  public displayMessageModal: boolean = false;
  private apiServerUrl=environment.apiBaseUrl;

  public simpleLoan = new SimpleLoan();
  public searchLoansResult: Loan[] = [];
  public allLoans! :any[];



  constructor(private loanService:LoanService,private bookService:BookService,
              private customerService:CustomerService,private http:HttpClient,
              private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.loanService.allLoans().subscribe(
      res=>{
        this.allLoans=res
        console.log(res)
      }
    )




    let dd = new Date("Thu Sep 08 2022 14:54:30 GMT+0100")
    console.log(dd)

    /*let counter = setInterval(()=>{
      let d = new Date();
      console.log(d)
      let ddd = dd.getTime()-d.getTime()
      console.log(ddd)
      if (ddd<0){
        clearInterval(counter);
        let mail = new Mail()
        mail.customerId = 28;
        mail.emailSubject="WARNING MAIL";
        mail.emailContent="you passed the max end date , you must return the book";
        this.loanService.sendEmail(mail).subscribe(
          result=>{
            console.log(mail)
            console.log('time out : mail sent');
          },error => {
            console.log(error)
          }
        );
      }
    },1000);*/
  }

  saveLoan(addLoanForm:NgForm){
    this.spinner.show();
    this.displayMessageModal = false;
    if (!addLoanForm.valid){
      this.buildMessageModal('Error in the form');
    }
    let book = this.http.get<Book>(`${this.apiServerUrl}/rest/book/api/searchByIsbn?isbn=`+this.simpleLoan.isbn);
    let customer = this.http.get<Customer>(`${this.apiServerUrl}/rest/customer/api/searchByEmail?email=`+this.simpleLoan.email);
    forkJoin([book,customer]).subscribe(
      results=>{
        if ((results[0] && results[0].id)&&(results[1] && results[1].id)){
          this.simpleLoan.bookId = results[0].id;
          this.simpleLoan.customerId = results[1].id;
          this.saveNewLoan(this.simpleLoan);
        }else {
          this.buildMessageModal('');
          this.spinner.hide();
        }
      }
    );
  }

  saveNewLoan(simpleLoan:SimpleLoan){
    simpleLoan.beginDate = this.setLocalDateDatePicker(simpleLoan.beginDate);
    simpleLoan.endDate = this.setLocalDateDatePicker(simpleLoan.endDate);
    this.loanService.saveLoan(simpleLoan).subscribe(
      (result:Loan)=>{
        if (result){
          this.spinner.hide();
          this.buildMessageModal('Save operation correctly done')
        }
      },error=>{
        this.spinner.hide();
        this.buildMessageModal('An error occurs when saving the loan data')
      }
    );
  }

  setLocalDateDatePicker(date: Date): Date {
    var localDate = new Date(date);
    if(localDate.getTimezoneOffset() < 0){
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset() );
    }else{
      localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset() );
    }
    return localDate;
  }

  closeLoan(loan:Loan){
    this.spinner.show();
    this.displayMessageModal = false;
    let simpleLoan = new SimpleLoan();
    let book = this.http.get<Book>(`${this.apiServerUrl}/rest/book/api/searchByIsbn?isbn=`+loan.bookDTO.isbn)
    let customer = this.http.get<Customer>(`${this.apiServerUrl}/rest/customer/api/searchByEmail?email=`+loan.customerDTO.email)
    forkJoin([book,customer]).subscribe(
      results=>{
        if ((results[0] && results[0].id)&&(results[1] && results[1].id)){
          simpleLoan.bookId = results[0].id;
          simpleLoan.customerId = results[1].id;
          this.loanService.closeLoan(simpleLoan).subscribe(
            result=>{
              this.spinner.hide();
              this.buildMessageModal('Loan closed');
            }
          );
        }
      }
    );
  }

  clearForm(addLoanForm: NgForm){
    addLoanForm.form.reset();
    this.displayMessageModal = false;
  }

  searchLoansByType(searchLoanForm:NgForm){
    this.spinner.show();
    this.displayMessageModal  =false;
    if (!searchLoanForm.valid){
      this.buildMessageModal('Error in the form')
    }
    if (this.displayType === 'Email'){
      this.searchLoansResult = [];
      this.loanService.searchLoanByEmail(this.email).subscribe(
        (result:Loan[])=>{
          this.treatResult(result);
          this.spinner.hide();
        },error =>{
          this.spinner.hide();
          this.buildMessageModal('An error occurs when searching the loan data');
        }
      )

    }else if (this.displayType === 'Maximum date'){
      this.searchLoansResult = [];
      this.loanService.searchLoanByMaxDate(this.maxDate).subscribe(
        (result:Loan[])=>{
          this.treatResult(result);
          this.spinner.hide();
        },error=>{
          this.spinner.hide();
          this.buildMessageModal('An error occurs when searching the loan data');
        }
      );
    }
    this.isFormSubmitted = searchLoanForm.submitted;
  }

  treatResult(result: Loan[]){
    if(result){
      this.searchLoansResult = result;
      this.isNoResult = false;
      return;
    }
    this.isNoResult = true;
  }

  displaySendEmailForm(id: number){
    this.customerId = id;
    this.isDisplaySendEmailForm = true;
    this.disabledBackground = true;
    this.displayMessageModal = false;
  }

  closeEmailForm(){
    this.isDisplaySendEmailForm = false;
    this.disabledBackground = false;
    this.displayMessageModal = false;
  }

 buildMessageModal(msg: string){
    this.messageModal = msg;
    this.displayMessageModal = true;
  }

  /*sendWarningMail(){
    Observable
    let counter = interval(
      /!*() => {
        let dateNow = new Date().getTime();
        for (var i=0;i<this.searchLoansResult.length;i++){
          let loan = this.searchLoansResult[i];
          let dateDiff = loan.loanEndDate.getTime() - dateNow;
          if (dateDiff<0){
            let mail = new Mail()
            mail.customerId = loan.customerDTO.id;
            mail.emailSubject="WARNING MAIL";
            mail.emailContent="you passed the max end date , you must return the book : "+loan.bookDTO.title;
            this.loanService.sendEmail(mail);
            clearInterval(counter)
          }
        }
      },*!/ 1000);
    counter.subscribe(
      (d)=>{
        //console.log(d)
      }
    )
  }*/

}

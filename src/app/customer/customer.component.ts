import { Component, OnInit } from '@angular/core';
import {Customer} from "../models/customer";
import {CustomerService} from "../service/customer.service";
import {NgxSpinner, NgxSpinnerService} from "ngx-spinner";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  public types = [ 'Email', 'Last Name'];
  public email!: string;
  public lastName!: string;
  public displayType: string = 'Email'
  public headsTab = ['FIRST NAME', 'LAST NAME', 'EMAIL', 'JOB', 'ADDRESS'];
  public isNoResult: boolean = true;
  public isFormSubmitted: boolean = false;
  public actionButton: string = 'Save';
  public titleSaveOrUpdate: string = 'Add New Customer Form';
  public messageModal!: string;
  public displayMessageModal: boolean = false;

  public customer = new Customer();
  public searchCustomersResult: Customer[] = [];

  constructor(private customerService:CustomerService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
  }

  saveOrUpdateCustomer(addCustomerForm:NgForm){
    this.displayMessageModal=false;
    if (!addCustomerForm.valid){
      this.buildMessageModal('Error in the form');
    }
    if (this.actionButton && this.actionButton === 'Save'){
      this.saveNewCustomer(this.customer)
    }else if (this.actionButton && this.actionButton === 'Update'){
      this.updateCustomer(this.customer);
    }
    this.titleSaveOrUpdate='Add New Customer Form';
    this.actionButton = 'Save';
  }

  saveNewCustomer(customer:Customer){
    this.spinner.show();
    this.customerService.saveCustomer(customer).subscribe(
      (result:Customer)=>{
        if (result.id){
          this.spinner.hide();
          this.buildMessageModal('Save operation correctly done');
        }
      },error => {
        this.spinner.hide();
        this.buildMessageModal('An error occurs when saving the customer data');
      }
    );
  }

  updateCustomer(customer:Customer){
    this.spinner.show();
    this.customerService.updateCustomer(customer).subscribe(
      (result:Customer)=>{
        if (result.id){
          this.updateResearchCustomerTab(customer);
          this.spinner.hide();
          this.buildMessageModal('Update operation correctly done');
        }
      },error => {
        this.spinner.hide();
        this.buildMessageModal('An error occurs when updating the customer data');
      }
    )
  }

  updateResearchCustomerTab(customer: Customer){
    let index : number = 0;
    if(this.searchCustomersResult && this.searchCustomersResult.length > 0){
      this.searchCustomersResult.forEach(element => {
        if(element.id == customer.id){
          this.searchCustomersResult.splice(index, 1, customer);

        }
        index++;
      });
    }
  }

  deleteCustomer(customer:Customer){
    this.spinner.show();
    this.displayMessageModal = false;
    this.customerService.deleteCustomer(customer).subscribe(
      result =>{
        for (var i=0;i<this.searchCustomersResult.length;i++){
          if (this.searchCustomersResult[i].id === customer.id){
            this.searchCustomersResult.splice(i,1);
          }
        }
        this.spinner.hide();
        this.buildMessageModal('End of delete operation');
        if (this.searchCustomersResult.length == 0){
          this.isNoResult = true;
        }
      }
    );
  }

  setUpdateCustomer(customer: Customer){
    this.titleSaveOrUpdate = 'Update Customer Form';
    this.actionButton = 'Update';
    this.customer = Object.assign({}, customer);
  }


  clearForm(addCustomerForm: NgForm){
    addCustomerForm.form.reset();
    this.displayMessageModal = false;
  }

  searchCustomersByType(searchCustomerForm:NgForm){
    this.spinner.show();
    this.displayMessageModal = false;
    if (!searchCustomerForm.valid){
      this.buildMessageModal('Error in the form')
    }
    if (this.displayType === 'Email'){
      this.searchCustomersResult = [];
      this.customerService.searchCustomerByEmail(this.email).subscribe(
        result=>{
          if (result){
            this.searchCustomersResult.push(result);
            this.isNoResult  =false;
            this.spinner.hide();
            return ;
          }
          this.isNoResult = true;
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.buildMessageModal('An error occurs when searching the customer data');
        }
      );
    }else if (this.displayType === 'Last Name'){
      this.searchCustomersResult = [];
      this.customerService.searchCustomerByLastName(this.lastName).subscribe(
        result=>{
          if (result){
            this.searchCustomersResult = result;
            this.isNoResult= false;
            this.spinner.hide();
            return ;
          }
          this.isNoResult = true;
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.buildMessageModal('An error occurs when searching the customer data');
        }
      );
    }
    this.isFormSubmitted = searchCustomerForm.submitted;
  }


  buildMessageModal(msg: string){
    this.messageModal = msg;
    this.displayMessageModal = true;
  }

}

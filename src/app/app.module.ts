import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BookComponent } from './book/book.component';
import { CustomerComponent } from './customer/customer.component';
import { LoanComponent } from './loan/loan.component';
import { MailModalComponent } from './modal/mail-modal/mail-modal.component';
import { MessageModalComponent } from './modal/message-modal/message-modal.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { BackToMenuComponent } from './menu/back-to-menu/back-to-menu.component';
import { MenuComponent } from './menu/menu/menu.component';
import {RouterModule} from "@angular/router";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {NgxSpinnerModule} from "ngx-spinner";
import {AppRoutingModule} from "./app.routing.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    CustomerComponent,
    LoanComponent,
    MailModalComponent,
    MessageModalComponent,
    BackToMenuComponent,
    MenuComponent
  ],
    imports: [
        BrowserModule,AppRoutingModule,HttpClientModule,
        FormsModule,
        MatDatepickerModule,MatInputModule,MatNativeDateModule,BrowserAnimationsModule,ReactiveFormsModule,
        RouterModule,NgxSpinnerModule
    ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

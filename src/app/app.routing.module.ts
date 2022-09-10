import {RouterModule, Routes} from "@angular/router";
import {MenuComponent} from "./menu/menu/menu.component";
import {BookComponent} from "./book/book.component";
import {CustomerComponent} from "./customer/customer.component";
import {LoanComponent} from "./loan/loan.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'book-page', component: BookComponent},
  {path: 'customer-page', component: CustomerComponent},
  {path: 'loan-page', component: LoanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }


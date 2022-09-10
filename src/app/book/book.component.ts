import { Component, OnInit } from '@angular/core';
import {Category} from "../models/category";
import {Book} from "../models/book";
import {BookService} from "../service/book.service";
import { NgxSpinnerService } from 'ngx-spinner';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  public types = [ 'Isbn', 'Title'];
  public isbn!: string;
  public title!: string;
  public displayType: string = 'Isbn'
  public headsTab = ['ISBN', 'TITLE', 'AUTHOR', 'RELEASE DATE', 'REGISTER DATE', 'TOTAL EXAMPLARIES', 'CATEGORY'];
  public isNoResult: boolean = true;
  public isFormSubmitted: boolean = false;
  public actionButton: string = 'Save';
  public titleSaveOrUpdate: string = 'Add New Book Form';
  public messageModal!: string;
  public displayMessageModal: boolean = false;

  public categories: Category[] = [{code:"", label:""}];
  public book = new Book();
  public searchBooksResult: Book[] = [];


  constructor(private bookService:BookService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(){
    this.spinner.show();
    this.bookService.loadCategories().subscribe(
      (result:Category[])=>{
        this.spinner.hide();
        console.log("categories fetched successfully")
        this.categories.push.apply(this.categories,result);
      },error => {
        this.spinner.hide();
        console.log("filed to fetch categories :",error)
        this.buildMessageModal('An error occurs when retrieving categories data')
      }
    );
  }

  saveOrUpdateBook(addBookForm:NgForm){
    this.displayMessageModal=false;
    if (!addBookForm.valid){
      window.alert('Error in the form')
    }
    this.setLocalDateToDatePicker(this.book);
    if(this.actionButton && this.actionButton === 'Save'){
      this.saveNewBook(this.book);
    }else if(this.actionButton && this.actionButton === 'Update'){
      this.updateBook(this.book);
    }
    this.titleSaveOrUpdate = 'Add New Book Form';
    this.actionButton = 'Save';
  }

  setLocalDateToDatePicker(book: Book){
    var localDate = new Date(book.releaseDate);
    if(localDate.getTimezoneOffset() < 0){
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset() );
    }else{
      localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset() );
    }
    book.releaseDate = localDate;
  }

  saveNewBook(book:Book){
    this.spinner.show();
    console.log('book before :',book)
    this.bookService.saveBook(book).subscribe(
      (result:Book)=>{
        if (result.id){
          console.log('saved book : ',result)
          this.spinner.hide();
          this.buildMessageModal('Save operation correctly done');
        }
      },error => {
        this.spinner.hide();
        this.buildMessageModal('An error occurs when saving the book data');
      }
    );
  }

  updateBook(book:Book){
    this.spinner.show();
    this.bookService.updateBook(book).subscribe(
      (result:Book)=>{
        if (result.id){
          this.updateResearchBooksTab(book);
          this.spinner.hide();
          this.buildMessageModal('Update operation correctly done');
        }
      },error => {
        this.spinner.hide();
        this.buildMessageModal('An error occurs when updating the book data');
      }
    )
  }

  updateResearchBooksTab(book:Book){
    if (this.searchBooksResult && this.searchBooksResult.length>0){
      let index : number = 0;
      this.searchBooksResult.forEach(element=>{
        if (element.id == book.id){
          this.searchBooksResult.splice(index,1,book)
        }
        index++;
      });
    }
  }

  deleteBook(book:Book){
    this.spinner.show();
    this.displayMessageModal =false;
    this.bookService.deleteBook(book).subscribe(
      result =>{
        for (var  i=0;i<this.searchBooksResult.length;i++){
          if (this.searchBooksResult[i].id == book.id){
            this.searchBooksResult.splice(i,1);
          }
        }
        this.spinner.hide();
        this.buildMessageModal('End of delete operation');
        if (this.searchBooksResult.length == 0){
          this.isNoResult=true;
        }
      }
    )
  }

  setUpdateBook(book: Book){
    this.titleSaveOrUpdate = 'Update Book Form';
    this.actionButton = 'Update';
    this.book = Object.assign({}, book);
    this.displayMessageModal = false;
  }

  clearForm(addBookForm: NgForm){
    addBookForm.form.reset();
    this.displayMessageModal = false;
  }

  searchBooksByType(searchBookForm:NgForm){
    this.spinner.show();
    this.displayMessageModal = false;
    if (!searchBookForm.valid){
      this.buildMessageModal('Error in the form');
    }
    if (this.displayType === 'Isbn'){
      this.searchBooksResult = [];
      this.bookService.searchBookByIsbn(this.isbn).subscribe(
        result=>{
          if (result){
            this.searchBooksResult.push(result);
            this.isNoResult = false;
            this.spinner.hide();
            return ;
          }
          this.isNoResult=true;
          this.spinner.hide();
        },error => {
          this.buildMessageModal('An error occurs when searching the book data');
        }
      );
    }else if (this.displayType === 'Title'){
      console.log(this.displayType)
      this.searchBooksResult =[];
      this.bookService.searchBookByTitle(this.title).subscribe(
        result=>{
          console.log(result)
          if (result){
            console.log('result : ',result)
            this.searchBooksResult = result;
            this.isNoResult = false;
            this.spinner.hide();
            return ;
          }
          this.isNoResult=true;
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.buildMessageModal('An error occurs when searching the book data');
        }
      );
    }
    this.isFormSubmitted = searchBookForm.submitted;
  }

  buildMessageModal(msg: string){
    this.messageModal = msg;
    this.displayMessageModal = true;
  }


}

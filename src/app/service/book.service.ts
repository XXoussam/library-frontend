import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../models/category";
import {Book} from "../models/book";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiServerUrl=environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  loadCategories(): Observable<Category[]>{
    let headers = new HttpHeaders();
    headers.append('content-type', 'application/json');
    headers.append('accept', 'application/json');
    return this.http.get<Category[]>(`${this.apiServerUrl}/rest/category/api/allCategories`,{headers:headers});

  }

  saveBook(book:Book):Observable<Book>{
    return this.http.post<Book>(`${this.apiServerUrl}/rest/book/api/addBook`,book);
  }

  updateBook(book:Book):Observable<Book>{
    console.log(book)
    return this.http.put<Book>(`${this.apiServerUrl}/rest/book/api/updateBook`,book);
  }

  deleteBook(book:Book):Observable<string>{
    return this.http.delete<string>(`${this.apiServerUrl}/rest/book/api/deleteBook/`+book.id);
  }

  searchBookByIsbn(isbn:string):Observable<Book>{
    return this.http.get<Book>(`${this.apiServerUrl}/rest/book/api/searchByIsbn?isbn=`+isbn);
  }

  searchBookByTitle(title:string):Observable<Book[]>{
    return this.http.get<Book[]>(`${this.apiServerUrl}/rest/book/api/searchByTitle?title=`+title);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Book } from './models/book.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {

  private API_PATH = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) { }

  searchBooks(queryTitle: string): Observable<Book[]> {
    return this.http
      .get<{ items: Book[] }>(`${this.API_PATH}?q=${queryTitle}&maxResults=40`)
      .pipe(map(books => books.items || []));
  }

}

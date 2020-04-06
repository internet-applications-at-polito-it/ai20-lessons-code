import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Book } from './models/book.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {

  private API_PATH = 'http://localhost:3000/books';

  constructor(private http: HttpClient) { }

  searchBooks(queryTitle: string): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.API_PATH}?q=${queryTitle}`)
      .pipe(map(books => books || []));
  }

  retrieveBook(volumeId: string): Observable<Book> {
      return this.http.get<Book>(`${this.API_PATH}/${volumeId}`);
    }

}

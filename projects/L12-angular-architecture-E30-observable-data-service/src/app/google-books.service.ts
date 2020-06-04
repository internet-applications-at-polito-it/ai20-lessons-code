import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { throwError, of } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { Book } from './models/book.model';

// see https://coryrylan.com/blog/angular-observable-data-services
//     https://stackblitz.com/edit/angular-fh1kyp

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {

  private _books = new BehaviorSubject<Book[]>([]);
  private dataStore: { books: Book[] } = { books: [] }; // local copy
  readonly books = this._books.asObservable();

  private API_PATH = 'http://localhost:3000/books';

  constructor(private http: HttpClient) { }

  searchBooks(queryTitle: string): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.API_PATH}?q=${queryTitle}`)
      .pipe(
        tap( data => {
          this.dataStore.books = data;
          this._books.next(data);
        }),
        catchError( err => {
          console.error(err);
          return throwError(`GoogleBooksService.searchBooks ${queryTitle} error: ${err.message}`);
        })
      );
  }


  retrieveBook(volumeId: string): Observable<Book> {
    return this.http.get<Book>(`${this.API_PATH}/${volumeId}`);
  }

  deleteBook(volumeId: string): Observable<Book[]> {
    const i = this.dataStore.books.findIndex( el => el.id === volumeId );
    // console.log(`GoogleBooksService deleteBook`);
    return this.http
    .delete<Book[]>(`${this.API_PATH}/${volumeId}`)
    .pipe(
      tap( data => {
        this.dataStore.books.splice(i, 1);
        this._books.next(this.dataStore.books);
      }),
      catchError( err => {
        console.error(err);
        return throwError(`GoogleBooksService.deleteBook with id: ${volumeId} error: ${err.message}`);
      })
    );

  }

}

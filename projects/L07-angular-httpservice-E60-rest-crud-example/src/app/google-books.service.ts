import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError, of } from 'rxjs';
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
      .pipe(
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
    // console.log(`GoogleBooksService deleteBook`);
    return this.http
    .delete<Book[]>(`${this.API_PATH}/${volumeId}`)
    .pipe(
      catchError( err => {
        console.error(err);
        return throwError(`GoogleBooksService.deleteBook with id: ${volumeId} error: ${err.message}`);
      })
    );
    /*
    .subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
    */
  }

}

import { Component, ViewChild, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { GoogleBooksService } from './google-books.service';
import { Book } from './models/book.model';

import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit {
  title = 'L07-angular-httpservice-E45-rest-example-autocomplete';
  displayedColumns = ['id', 'name', 'progress', 'color'];
  // dataSource: MatTableDataSource<Book>;
  dataSource$: Observable<Book[]>;
  selectedBook$: Observable<Book>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private googleBooksService: GoogleBooksService) {
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource();
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource$ = this.googleBooksService.searchBooks('angular');
    /*
    this.googleBooksService.searchBooks('angular')
      .subscribe( data => this.dataSource.data = data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    */

    // console.dir(this.input.nativeElement);

    const searchBooks$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        tap( (event) => {
          console.log(`The input value is ${event.target.value}`);
          return event;
        }),
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.queryFilter(search))
      );
    const initialBooks$ = this.queryFilter('');
    this.dataSource$ = concat(initialBooks$, searchBooks$);

  }

  queryFilter(filterValue: string = ''): Observable<Book[]> {
    console.log(`queryFilter(${filterValue})`);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.dataSource$ = this.googleBooksService.searchBooks(filterValue);
    return this.googleBooksService.searchBooks(filterValue);
  }

  retrieveBook(volumeId: string) {
    this.selectedBook$ = this.googleBooksService.retrieveBook(volumeId);
  }
}





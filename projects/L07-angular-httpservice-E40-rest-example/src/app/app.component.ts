import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {GoogleBooksService} from './google-books.service';
import { Book } from './models/book.model';
import { Observable } from 'rxjs';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit {
  title = 'L07-angular-httpservice-E40-rest-example';
  displayedColumns = ['id', 'name', 'progress', 'color'];
  // dataSource: MatTableDataSource<Book>;
  dataSource$: Observable<Book[]>;
  selectedBook$: Observable<Book>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  }

  queryFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    this.dataSource$ = this.googleBooksService.searchBooks(filterValue);
  }

  retrieveBook(volumeId: string) {
    this.selectedBook$ = this.googleBooksService.retrieveBook(volumeId);
  }
}





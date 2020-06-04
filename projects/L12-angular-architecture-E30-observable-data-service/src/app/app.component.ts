import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// The MatDialog SERVICE !!! can be used to open modal dialogs with Material Design styling and animations.
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GoogleBooksService } from './google-books.service';
import { Book } from './models/book.model';
import { DeleteDialogComponent } from './dialogs/delete-dialog.component';
import { NotificationsSnackBarComponent } from './dialogs/notifications-snackbar.component';

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
import { merge, fromEvent, Observable, concat, Subscription } from 'rxjs';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'L07-angular-httpservice-E45-rest-example-autocomplete';
  displayedColumns = ['id', 'title', 'author', 'year', 'actions'];
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();

  dataSourceBooks$: Subscription;

  filterString = '';

  loadAll = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(
    private googleBooksService: GoogleBooksService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    // Assign the data to the data source for the table to render
    this.dataSourceBooks$ = googleBooksService.books.subscribe( data => this.dataSource.data = data );
  }

  ngOnInit() {
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {

    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        tap((event) => {
          console.log(`The input value is ${event.target.value}`);
          return event;
        }),
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
      ).subscribe(
        data => {
          this.filterString = data;
          this.googleBooksService.searchBooks(data).subscribe( /*check error */ );
        }
      );

    this.googleBooksService.searchBooks('').subscribe( /* check error */);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

  deleteBook(i: number, book: Book ) {
    console.log(`book row no. ${i}: ${JSON.stringify(book)}`);

    const dialogRef = this.dialog.open(
      DeleteDialogComponent,
      { data: book }
    );


    dialogRef.afterClosed().subscribe(result => {
      console.dir(result);

      if (result) {
        this.googleBooksService.deleteBook(result).subscribe(
          _ => { this.openSnackBar('Book ' + result + ' successfully deleted', ''); this.loadAll.emit(); },
          err => { this.openSnackBar('Unable to delete book ' + result, ''); }
        );
       
      }
    });

  }

  ngOnDestroy() {
    this.dataSourceBooks$.unsubscribe();
  }

}





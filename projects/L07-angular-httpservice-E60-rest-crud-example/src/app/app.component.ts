import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, EventEmitter } from '@angular/core';
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
import { merge, fromEvent, Observable, concat } from 'rxjs';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'L07-angular-httpservice-E45-rest-example-autocomplete';
  displayedColumns = ['id', 'title', 'author', 'year', 'actions'];
  dataSource: MatTableDataSource<Book>;
  // dataSource$: Observable<Book[]>;
  // dataSource: Book[];
  selectedBook$: Observable<Book>;
  initialBooks$: Observable<Book[]>;
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
    // this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Book>();
  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    // this.dataSource$ = this.googleBooksService.searchBooks('angular');
    /* this.initialBooks$ = */
    this.loadAll.subscribe(
      _ => this.queryFilter(this.filterString).subscribe(
        data => this.dataSource.data = data
      )
    );
    /*
    this.googleBooksService.searchBooks('angular')
      .subscribe( data => this.dataSource.data = data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    */

    // console.dir(this.input.nativeElement);

    // const searchBooks$ =
    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        tap((event) => {
          console.log(`The input value is ${event.target.value}`);
          return event;
        }),
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        // tap(search => { this.filterString = search; this.loadAll.emit(); }),
        // switchMap(search => this.queryFilter(search)),
      ).subscribe(
        data => { this.filterString = data; this.loadAll.emit(); }
      )
      /*
      .subscribe(
        data => this.dataSource.data = data
      )
      */
      ;

    // this.dataSource$ = concat(this.initialBooks$, searchBooks$); // why initialBooks?
    this.loadAll.emit();

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }
  /*
  openSnackBar() {
    this._snackBar.openFromComponent(NotificationsSnackBarComponent, {
      duration: 3 * 1000,
    });
  }
  */

  queryFilter(filterValue: string = ''): Observable<Book[]> {
    console.log(`queryFilter(${filterValue})`);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.dataSource$ = this.googleBooksService.searchBooks(filterValue);
    return this.googleBooksService.searchBooks(filterValue);
  }

  /*
  retrieveBook(volumeId: string) {
    this.selectedBook$ = this.googleBooksService.retrieveBook(volumeId);
  }
  */

  deleteBook(i: number, book: Book /* id: number, title: string, state: string, url: string */) {
    console.log(`book row no. ${i}: ${JSON.stringify(book)}`);
    /*
    this.index = i;
    this.id = id;
    */

    const dialogRef = this.dialog.open(
      DeleteDialogComponent,
      { data: book }
    );


    dialogRef.afterClosed().subscribe(result => {
      console.dir(result);
      /* this.dataSource$ = */

      if (result) {
        this.googleBooksService.deleteBook(result).subscribe(
          _ => { this.openSnackBar('Book ' + result + ' successfully deleted', ''); this.loadAll.emit(); },
          err => { this.openSnackBar('Unable to delete book ' + result, ''); }
        );
        /*
        concat(this.googleBooksService.deleteBook(result), this.queryFilter(this.filterString)).subscribe(
          data => this.dataSource = data,
          err => console.error(err.message)
        );
        */


        /*
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
        */
      }
    });

  }

}





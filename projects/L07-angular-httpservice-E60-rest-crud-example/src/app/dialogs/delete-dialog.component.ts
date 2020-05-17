import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GoogleBooksService } from '../google-books.service';

import { Book } from '../models/book.model';


@Component({
  selector: 'app-delete-dialog',
  template: `
  <div class="container">
  <h3 mat-dialog-title>Are you sure?</h3>
  <div mat-dialog-content>
    Id: {{data.id}}
    <p></p>
    Title: {{data.title}}
    <p></p>
    Author: {{data.authors}}
    <p></p>
    Year: {{data.publishedDate}}
    <p></p>
  </div>

  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="data.id" cdkFocusInitial>Delete</button>
    <button mat-button (click)="onNoClick()" tabindex="-1">Cancel</button>
  </div>
</div>
  `,
  styles: ['.container { display: flex; flex-direction: column; }', '.container > * { width: 100%; }']
})
export class DeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book,
    // To access the data in your dialog component, you have to use the MAT_DIALOG_DATA injection token:
    public dataService: GoogleBooksService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    console.log('Deleting: ');
    console.dir(this.data);
    this.dataService.deleteBook(this.data.id);
  }
}

import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { getReadingList, removeFromReadingList, addToReadingList } from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store,private _snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    const snackBar= this._snackBar.open(`Removed ${item.title} from reading List`, "Undo", {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000
    });
    snackBar.onAction().subscribe(() => {
      this.store.dispatch(addToReadingList({
        book: {
          id: item.bookId, ...item
        }
      }))
    })
  }
}
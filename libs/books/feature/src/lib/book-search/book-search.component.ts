import { Component, OnInit,OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Observable, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit ,OnDestroy{
  books: ReadingListBook[];
  readonly getBooks$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  readonly bookSearchError$: any = this.store.select(getBooksError);
  bookSubscription$: Subscription;
  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}
  
  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.bookSubscription$ = this.searchForm.get("term").valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((queryData) => {
        return of(queryData);
      }))
    .subscribe(newData => {
    if (newData) {
      this.store.dispatch(searchBooks({ term: newData }));
    } else {
      this.store.dispatch(clearSearch());
    }
  })
    
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
  }

  ngOnDestroy(): void {
    this.bookSubscription$.unsubscribe();
  }

}
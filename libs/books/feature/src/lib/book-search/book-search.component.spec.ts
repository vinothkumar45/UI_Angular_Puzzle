import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '@tmo/books/feature';
import { BookSearchComponent } from './book-search.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addToReadingList, clearSearch, getAllBooks, getBooksError, getBooksLoaded, searchBooks } from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore({ initialState: { books: { entities: [] } } }),]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getAllBooks, []);
    store.overrideSelector(getBooksError, '');
    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('formatDate() : should return formatted data', () => {
    let result = component.formatDate('08/22/2020');
    expect(result).toBe('8/22/2020');
    result = component.formatDate('');
    expect(result).toBeUndefined();
  })

  it('should add book to reading list', () => {
    const book: Book = createBook('B');
    component.addBookToReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book }));
  });

  it('should search books with the search term', fakeAsync(() => {
    component.searchForm.controls.term.setValue('testing1');
    tick(500);
    store.overrideSelector(getBooksLoaded, true);
    store.overrideSelector(getAllBooks, [{ ...createBook('A'), isAdded: false }]);
    store.refreshState();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'testing1' })
    );
  }));

  it('should dispatch clear search if no search term is exists', fakeAsync(() => {
    component.searchForm.controls.term.setValue('');
    tick(500);
    store.refreshState();
    expect(store.dispatch).toHaveBeenCalledWith(
      clearSearch()
    );
  }));

  it('should search books with the search example', fakeAsync(() => {
    fixture.detectChanges();
    component.searchExample();
    tick(500);
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'javascript' })
    );
  }));
});
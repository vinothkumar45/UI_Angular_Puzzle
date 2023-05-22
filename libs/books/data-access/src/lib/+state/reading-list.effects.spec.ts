import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should load reading list', done => {
    actions = new ReplaySubject();
    actions.next(effects.ngrxOnInitEffects());
    effects.loadReadingList$.subscribe(action => {
      expect(action).toEqual(
        ReadingListActions.loadReadingListSuccess({ list: [] })
      );
      done();
    });
    httpMock.expectOne('/api/reading-list').flush([]);
  });

  it('should fail to load reading list', done => {
    actions = new ReplaySubject();
    actions.next(ReadingListActions.init());
    const outcome = ReadingListActions.loadReadingListError(new ErrorEvent("error"));
    effects.loadReadingList$.subscribe(action => {
      expect(action.type).toEqual(outcome.type);
      done();
    });
    httpMock.expectOne('/api/reading-list').error(new ErrorEvent("error"));
  });

  it('should add book to reading list', done => {
    actions = new ReplaySubject();
    actions.next(ReadingListActions.addToReadingList({book: createBook('abc')}));

    effects.addBook$.subscribe(action => {
      expect(action).toEqual(
        ReadingListActions.confirmedAddToReadingList({book: createBook('abc')})
      );
      done();
    });

    httpMock.expectOne('/api/reading-list').flush({book: createBook('abc')});
  });

  it('should remove book from reading list', done => {
    actions = new ReplaySubject();
    actions.next(ReadingListActions.removeFromReadingList({item: createReadingListItem('123')}));

    effects.removeBook$.subscribe(action => {
      expect(action).toEqual(
        ReadingListActions.confirmedRemoveFromReadingList({item: createReadingListItem('123')})
      );
      done();
    });

    httpMock.expectOne('/api/reading-list/123').flush({item: createReadingListItem('123')});
  });

  it('should return failedAddToReadingList with book, on fail', (done) => {
    const book = createBook('B');
    actions = new ReplaySubject();
    actions.next(ReadingListActions.addToReadingList({ book }));

    effects.addBook$.subscribe((action) => {
      expect(action).toEqual(
        ReadingListActions.failedAddToReadingList({ book })
      );
      done();
    });
    httpMock
      .expectOne(`/api/reading-list`)
      .flush(book, { status: 400, statusText: 'Bad Request' });
  });

  it('should return failedRemoveFromReadingList with readingItem, on fail', (done) => {
    const item = createReadingListItem('B');
    actions = new ReplaySubject();
    actions.next(ReadingListActions.removeFromReadingList({ item }));
    effects.removeBook$.subscribe((action) => {
      expect(action).toEqual(
        ReadingListActions.failedRemoveFromReadingList({ item })
      );
      done();
    });
    httpMock
      .expectOne(`/api/reading-list/${item.bookId}`)
      .flush(item, { status: 400, statusText: 'Cannot Delete Reading Item' });
  });
});
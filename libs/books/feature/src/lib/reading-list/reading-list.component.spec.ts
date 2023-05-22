import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReadingListItem } from '@tmo/shared/models';
import { getReadingList, removeFromReadingList,addToReadingList } from '@tmo/books/data-access';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;
  let spyTest: any;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [provideMockStore({ initialState: { items: {} } }),]
    }).compileComponents();
    store = TestBed.inject(MockStore);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getReadingList, []);
    fixture.detectChanges();
    spyTest = spyOn(store, 'dispatch').and.callThrough();
  });
  afterEach(() => {
    fixture.destroy();
  });
  it('should remove book from reading list', () => {
    const book: ReadingListItem = createReadingListItem('B');
    component.removeFromReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(removeFromReadingList({ item: book }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should remove book from reading list and trigger UNDO action', () => {
    const book: ReadingListItem = createReadingListItem('B');
    component.removeFromReadingList(book);
    const buttonElement: HTMLElement = overlayContainerElement.querySelector('.mat-simple-snackbar-action > button');
    buttonElement?.click();
    expect(store.dispatch).toHaveBeenCalledWith(removeFromReadingList({ item: book }));
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(spyTest).toHaveBeenCalledWith(addToReadingList({book: {...book, id: 'B'}}));
  });
});
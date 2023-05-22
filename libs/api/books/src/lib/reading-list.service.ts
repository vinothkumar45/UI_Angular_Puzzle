import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
      return list.filter(x => x.bookId !== id);
    });
  }
  async markAsRead(id: string): Promise<ReadingListItem> {
    let itemToBeUpdated: ReadingListItem;
    this.storage.update(list => {
      const itemIndex: number = list.findIndex(book => book.bookId === id);
      itemToBeUpdated = list[itemIndex];
      itemToBeUpdated.finished = true;
      itemToBeUpdated.finishedDate = new Date().toISOString();
      list[itemIndex] = itemToBeUpdated;
      return list;
    });
    return itemToBeUpdated;
  }
}
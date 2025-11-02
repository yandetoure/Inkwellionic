import { Injectable } from '@angular/core';

export interface ReadingList {
  id: string;
  name: string;
  bookIds: Array<string | number>;
}

@Injectable({ providedIn: 'root' })
export class ReadingListService {
  private readonly storageKey = 'readingLists:v1';

  private readAll(): ReadingList[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private writeAll(all: ReadingList[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  getLists(): ReadingList[] {
    return this.readAll();
  }

  createList(name: string): ReadingList {
    const lists = this.readAll();
    const newList: ReadingList = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name,
      bookIds: [],
    };
    lists.push(newList);
    this.writeAll(lists);
    return newList;
  }

  addBookToList(listId: string, bookId: string | number): void {
    const lists = this.readAll();
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    if (!list.bookIds.includes(bookId)) {
      list.bookIds.push(bookId);
      this.writeAll(lists);
    }
  }

  removeBookFromList(listId: string, bookId: string | number): void {
    const lists = this.readAll();
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    list.bookIds = list.bookIds.filter(id => String(id) !== String(bookId));
    this.writeAll(lists);
  }

  getListsContainingBook(bookId: string | number): ReadingList[] {
    const lists = this.readAll();
    return lists.filter(l => l.bookIds.some(id => String(id) === String(bookId)));
  }
}



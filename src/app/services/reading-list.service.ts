import { Injectable } from '@angular/core';

export interface ReadingList {
  id: string;
  name: string;
  bookIds: Array<string | number>;
  createdAt: number;
}

const STORAGE_KEY = 'reading_lists_v1';

@Injectable({ providedIn: 'root' })
export class ReadingListService {
  private read(): ReadingList[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ReadingList[]) : [];
    } catch {
      return [];
    }
  }

  private write(lists: ReadingList[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }

  getLists(): ReadingList[] {
    return this.read();
  }

  createList(name: string): ReadingList {
    const lists = this.read();
    const list: ReadingList = { id: crypto.randomUUID(), name, bookIds: [], createdAt: Date.now() };
    lists.push(list);
    this.write(lists);
    return list;
  }

  addBookToList(listId: string, bookId: string | number): void {
    const lists = this.read();
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    if (!list.bookIds.includes(bookId)) list.bookIds.push(bookId);
    this.write(lists);
  }
}



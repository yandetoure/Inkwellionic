import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReadingList {
  id: string;
  name: string;
  bookIds: Array<string | number>;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class ReadingListService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getLists(): Observable<ReadingList[]> {
    return this.http.get<ReadingList[]>(`${this.baseUrl}/reading-lists`);
  }

  createList(name: string): Observable<ReadingList> {
    return this.http.post<ReadingList>(`${this.baseUrl}/reading-lists`, { name });
  }

  getList(id: string): Observable<ReadingList> {
    return this.http.get<ReadingList>(`${this.baseUrl}/reading-lists/${id}`);
  }

  addBookToList(listId: string, bookId: string | number): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/reading-lists/${listId}/books`, { bookId })
      .pipe(map(() => undefined));
  }

  removeBookFromList(listId: string, bookId: string | number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/reading-lists/${listId}/books/${bookId}`)
      .pipe(map(() => undefined));
  }

  deleteList(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reading-lists/${id}`).pipe(map(() => undefined));
  }
}

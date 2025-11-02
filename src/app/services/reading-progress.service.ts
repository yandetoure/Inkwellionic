import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BookProgress {
  chapterId?: string | number;
  chapterNumber?: number;
  updatedAt: number;
}

@Injectable({ providedIn: 'root' })
export class ReadingProgressService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  hasProgress(bookId: string | number): Observable<boolean> {
    return this.http
      .get<{ hasProgress: boolean }>(`${this.baseUrl}/reading-progress/${bookId}/has`)
      .pipe(map((response) => response.hasProgress));
  }

  getProgress(bookId: string | number): Observable<BookProgress | undefined> {
    return this.http
      .get<BookProgress | null>(`${this.baseUrl}/reading-progress/${bookId}`)
      .pipe(map((progress) => progress || undefined));
  }

  setProgress(
    bookId: string | number,
    chapterId?: string | number,
    chapterNumber?: number,
  ): Observable<BookProgress> {
    return this.http.post<BookProgress>(`${this.baseUrl}/reading-progress`, {
      bookId,
      chapterId,
      chapterNumber,
    });
  }

  getAllProgress(): Observable<Record<string | number, BookProgress>> {
    return this.http.get<Record<string | number, BookProgress>>(`${this.baseUrl}/reading-progress`);
  }
}

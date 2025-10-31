import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BookSummary {
  id: number | string;
  title?: string;
  author?: string;
  category?: string;
  cover?: string;
  description?: string;
  total_likes?: number;
  is_paid?: boolean;
  free_chapters_count?: number;
  rating?: number;
}

export interface BookChapterSummary {
  id: number | string;
  number: number;
  title: string;
  content?: string;
  wordCount?: number;
  views?: number;
  likes?: number;
  isLiked?: boolean;
  isPaid?: boolean;
  coinCost?: number;
}

export interface BookDetail extends BookSummary {
  authorId?: number | string;
  chapters?: BookChapterSummary[];
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getBooks(): Observable<BookSummary[]> {
    return this.http.get<BookSummary[]>(`${this.baseUrl}/books`);
  }

  getBook(id: string | number): Observable<BookDetail> {
    return this.http.get<BookDetail>(`${this.baseUrl}/books/${id}`);
  }
}



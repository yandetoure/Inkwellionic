import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChapterDetail {
  id: number | string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  views: number;
  likes: number;
  comments: unknown[];
  isLiked: boolean;
  isPaid: boolean;
  coinCost: number;
}

@Injectable({ providedIn: 'root' })
export class ChapterService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getChapter(bookId: string | number, chapterId: string | number): Observable<ChapterDetail> {
    return this.http.get<ChapterDetail>(`${this.baseUrl}/books/${bookId}/chapters/${chapterId}`);
  }
}



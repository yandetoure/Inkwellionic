import { Injectable } from '@angular/core';

export interface BookProgress {
  chapterId?: string | number;
  chapterNumber?: number;
  updatedAt: number;
}

type ProgressMap = Record<string | number, BookProgress>;

const STORAGE_KEY = 'reading_progress_v1';

@Injectable({ providedIn: 'root' })
export class ReadingProgressService {
  private readStorage(): ProgressMap {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ProgressMap) : {};
    } catch {
      return {};
    }
  }

  private writeStorage(map: ProgressMap): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }

  hasProgress(bookId: string | number): boolean {
    const map = this.readStorage();
    return !!map[bookId];
  }

  getProgress(bookId: string | number): BookProgress | undefined {
    const map = this.readStorage();
    return map[bookId];
  }

  setProgress(bookId: string | number, chapterId?: string | number, chapterNumber?: number): void {
    const map = this.readStorage();
    map[bookId] = { chapterId, chapterNumber, updatedAt: Date.now() };
    this.writeStorage(map);
  }
}



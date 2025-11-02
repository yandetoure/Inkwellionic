import { Injectable } from '@angular/core';

interface StoredProgress {
  [bookId: string]: {
    chapterId: string;
    chapterNumber?: number;
    updatedAt: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ReadingProgressService {
  private readonly storageKey = 'readingProgress:v1';

  private readAll(): StoredProgress {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private writeAll(all: StoredProgress): void {
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  getProgress(bookId: string | number): { chapterId: string; chapterNumber?: number } | null {
    const all = this.readAll();
    const key = String(bookId);
    const entry = all[key];
    return entry ? { chapterId: entry.chapterId, chapterNumber: entry.chapterNumber } : null;
  }

  hasProgress(bookId: string | number): boolean {
    return !!this.getProgress(bookId);
  }

  setProgress(bookId: string | number, chapterId: string | number, chapterNumber?: number): void {
    const all = this.readAll();
    all[String(bookId)] = {
      chapterId: String(chapterId),
      chapterNumber,
      updatedAt: Date.now(),
    };
    this.writeAll(all);
  }
}



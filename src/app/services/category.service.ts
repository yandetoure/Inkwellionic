import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookService } from './book.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private readonly booksApi: BookService) {}

  getCategories(): Observable<string[]> {
    return this.booksApi.getBooks().pipe(
      map((books) => {
        const set = new Set<string>();
        for (const b of books) {
          if (b.category) set.add(b.category);
        }
        return Array.from(set).sort((a, z) => a.localeCompare(z));
      })
    );
  }
}



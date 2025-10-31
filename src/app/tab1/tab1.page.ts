import { Component, OnInit } from '@angular/core';
import { BookService, BookSummary } from '../services/book.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  books: BookSummary[] = [];

  constructor(
    private readonly booksApi: BookService,
  ) {}

  ngOnInit(): void {
    this.booksApi.getBooks().subscribe((res) => (this.books = res));
  }

  getViews(b: any): number {
    if (Array.isArray(b?.chapters)) {
      return b.chapters.reduce((sum: number, c: any) => sum + (c?.views || 0), 0);
    }
    return 0;
  }
}

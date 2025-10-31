import { Component, OnInit } from '@angular/core';
import { BookService, BookSummary } from '../services/book.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  books: BookSummary[] = [];

  constructor(private readonly booksApi: BookService) {}

  ngOnInit(): void {
    this.booksApi.getBooks().subscribe((res) => {
      this.books = Array.isArray(res) ? res : [];
    });
  }
}

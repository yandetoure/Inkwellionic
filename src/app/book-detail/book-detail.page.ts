import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService, BookDetail } from '../services/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: 'book-detail.page.html',
  styleUrls: ['book-detail.page.scss'],
  standalone: false,
})
export class BookDetailPage implements OnInit {
  book?: BookDetail;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly booksApi: BookService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.booksApi.getBook(id).subscribe((b) => (this.book = b));
    }
  }
}



import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReadingListService, ReadingList } from '../services/reading-list.service';
import { BookService, BookSummary } from '../services/book.service';

@Component({
  selector: 'app-reading-list-detail',
  templateUrl: './reading-list-detail.page.html',
  styleUrls: ['./reading-list-detail.page.scss'],
  standalone: false,
})
export class ReadingListDetailPage implements OnInit {
  list?: ReadingList;
  books: BookSummary[] = [];
  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly listsService: ReadingListService,
    private readonly bookService: BookService,
  ) {}

  ngOnInit(): void {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.loadList(listId);
    }
  }

  ionViewWillEnter(): void {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.loadList(listId);
    }
  }

  loadList(listId: string): void {
    this.loading = true;
    this.listsService.getList(listId).subscribe({
      next: (list) => {
        this.list = list;

        if (list.bookIds.length === 0) {
          this.books = [];
          this.loading = false;
          return;
        }

        // Charger tous les livres de la liste
        const bookRequests = list.bookIds.map((bookId) =>
          this.bookService.getBook(bookId).pipe(
            map((book) => ({
              id: book.id,
              title: book.title,
              author: book.author,
              category: book.category,
              cover: book.cover,
              description: book.description,
              total_likes: book.total_likes,
              is_paid: book.is_paid,
              free_chapters_count: book.free_chapters_count,
              rating: book.rating,
            } as BookSummary)),
            catchError(() => of(null)),
          ),
        );

        forkJoin(bookRequests).subscribe((results) => {
          this.books = results.filter((book): book is BookSummary => book !== null);
          this.loading = false;
        });
      },
      error: () => {
        this.router.navigate(['/tabs/tab3']);
        this.loading = false;
      },
    });
  }

  openBook(bookId: string | number): void {
    this.router.navigate(['/tabs/book', bookId]);
  }
}


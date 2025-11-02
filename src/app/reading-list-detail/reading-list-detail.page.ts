import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReadingListService, ReadingList } from '../services/reading-list.service';
import { BookService, BookSummary } from '../services/book.service';
import { ReadingProgressService } from '../services/reading-progress.service';

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
    private readonly progress: ReadingProgressService,
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
    const lists = this.listsService.getLists();
    this.list = lists.find(l => l.id === listId);

    if (!this.list) {
      this.router.navigate(['/tabs/tab3']);
      return;
    }

    if (this.list.bookIds.length === 0) {
      this.books = [];
      this.loading = false;
      return;
    }

    // Charger tous les livres de la liste
    const bookRequests = this.list.bookIds.map((bookId) =>
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
  }

  openBook(bookId: string | number): void {
    // Navigation vers la page de lecture
    const progress = this.progress.getProgress(bookId);
    if (progress?.chapterId) {
      this.router.navigate(['/tabs/read', bookId, progress.chapterId]);
    } else {
      // Charger le livre pour obtenir le premier chapitre
      this.bookService.getBook(bookId).subscribe((book) => {
        const firstChapterId = book.chapters?.[0]?.id;
        if (firstChapterId) {
          this.router.navigate(['/tabs/read', bookId, firstChapterId]);
        } else {
          // Si pas de chapitre, aller à la page de détail
          this.router.navigate(['/tabs/book', bookId]);
        }
      });
    }
  }
}


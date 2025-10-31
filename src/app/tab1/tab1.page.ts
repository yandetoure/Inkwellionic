import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService, BookSummary, BookDetail } from '../services/book.service';
import { ReadingProgressService } from '../services/reading-progress.service';
import { ReadingListService } from '../services/reading-list.service';

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
    private readonly progress: ReadingProgressService,
    private readonly lists: ReadingListService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.booksApi.getBooks().subscribe((res) => (this.books = res));
  }

  hasProgress(bookId: string | number): boolean {
    return this.progress.hasProgress(bookId);
  }

  getActionLabel(bookId: string | number): string {
    return this.hasProgress(bookId) ? 'Continuer la lecture' : 'Commencer à lire';
  }

  async onReadClick(b: BookSummary): Promise<void> {
    const p = this.progress.getProgress(b.id);
    if (p?.chapterId) {
      this.router.navigate(['/tabs/read', b.id, p.chapterId]);
      return;
    }
    // Fetch detail to get first chapter
    this.booksApi.getBook(b.id).subscribe((detail: BookDetail) => {
      const first = detail?.chapters && detail.chapters[0];
      if (first) {
        this.router.navigate(['/tabs/read', b.id, first.id]);
      } else {
        this.router.navigate(['/tabs/book', b.id]);
      }
    });
  }

  onAddToList(b: BookSummary): void {
    const name = prompt('Nom de la nouvelle liste de lecture:');
    if (!name) return;
    const list = this.lists.createList(name);
    this.lists.addBookToList(list.id, b.id);
    alert(`Ajouté à la liste "${list.name}"`);
  }
}

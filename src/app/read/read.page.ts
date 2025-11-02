import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService, ChapterDetail } from '../services/chapter.service';
import { BookService, BookChapterSummary } from '../services/book.service';
import { ReadingProgressService } from '../services/reading-progress.service';

@Component({
  selector: 'app-read',
  templateUrl: 'read.page.html',
  styleUrls: ['read.page.scss'],
  standalone: false,
})
export class ReadPage implements OnInit {
  chapter?: ChapterDetail;
  bookId!: string;
  chapterId!: string;
  chapters: BookChapterSummary[] = [];
  isMenuOpen = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly chaptersApi: ChapterService,
    private readonly booksApi: BookService,
    private readonly progress: ReadingProgressService,
  ) {}

  ngOnInit(): void {
    this.bookId = String(this.route.snapshot.paramMap.get('bookId'));
    this.chapterId = String(this.route.snapshot.paramMap.get('chapterId'));
    if (this.bookId && this.chapterId) {
      this.chaptersApi.getChapter(this.bookId, this.chapterId).subscribe((c) => {
        this.chapter = c;
        this.progress.setProgress(this.bookId, this.chapterId, c.number);
      });
      
      // Charger la liste des chapitres du livre
      this.booksApi.getBook(this.bookId).subscribe((book) => {
        this.chapters = book.chapters || [];
      });
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectChapter(ch: BookChapterSummary): void {
    if (!ch.isPaid || ch.id === this.chapterId) {
      this.router.navigate(['/tabs/read', this.bookId, ch.id]);
      this.isMenuOpen = false;
    }
  }
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService, ChapterDetail } from '../services/chapter.service';
import { BookService, BookChapterSummary, BookDetail } from '../services/book.service';
import { ReadingProgressService } from '../services/reading-progress.service';

@Component({
  selector: 'app-read',
  templateUrl: 'read.page.html',
  styleUrls: ['read.page.scss'],
  standalone: false,
})
export class ReadPage implements OnInit {
  chapter?: ChapterDetail;
  book?: BookDetail;
  bookId!: string;
  chapterId!: string;
  chapters: BookChapterSummary[] = [];
  isMenuOpen = false;
  isLiked = false;
  likes = 0;
  commentsCount = 0;
  actualWordCount = 0;

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
        this.isLiked = c.isLiked;
        this.likes = c.likes;
        this.commentsCount = c.comments?.length || 0;
        this.actualWordCount = this.countWords(c.content);
      });
      
      // Charger la liste des chapitres du livre
      this.booksApi.getBook(this.bookId).subscribe((book) => {
        this.book = book;
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

  toggleLike(): void {
    this.isLiked = !this.isLiked;
    this.likes = this.isLiked ? this.likes + 1 : this.likes - 1;
  }

  toggleComments(): void {
    console.log('Toggle comments');
    // TODO: Implémenter l'ouverture des commentaires
  }

  share(): void {
    console.log('Share');
    // TODO: Implémenter le partage
  }

  countWords(text: string): number {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  }
}


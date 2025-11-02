import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterService, ChapterDetail } from '../services/chapter.service';
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly chaptersApi: ChapterService,
    private readonly progress: ReadingProgressService,
  ) {}

  ngOnInit(): void {
    this.bookId = String(this.route.snapshot.paramMap.get('bookId'));
    this.chapterId = String(this.route.snapshot.paramMap.get('chapterId'));
    if (this.bookId && this.chapterId) {
      this.chaptersApi.getChapter(this.bookId, this.chapterId).subscribe((c) => {
        this.chapter = c;
        this.progress.setProgress(this.bookId, this.chapterId, c.number).subscribe();
      });
    }
  }
}



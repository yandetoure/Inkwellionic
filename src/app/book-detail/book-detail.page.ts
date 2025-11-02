import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BookService, BookDetail } from '../services/book.service';
import { ReadingProgressService } from '../services/reading-progress.service';
import { ReadingListService, ReadingList } from '../services/reading-list.service';
import { ReadingListModalComponent } from '../components/reading-list-modal/reading-list-modal.component';

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
    private readonly router: Router,
    private readonly booksApi: BookService,
    private readonly progress: ReadingProgressService,
    private readonly lists: ReadingListService,
    private readonly modalController: ModalController,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.booksApi.getBook(id).subscribe((b) => (this.book = b));
    }
  }

  hasProgress(): boolean {
    if (!this.book) return false;
    return this.progress.hasProgress(this.book.id);
  }

  getActionLabel(): string {
    return this.hasProgress() ? 'Continuer la lecture' : 'Commencer à lire';
  }

  onReadClick(): void {
    if (!this.book) return;
    const p = this.progress.getProgress(this.book.id);
    // prefer saved chapter, else first chapter
    const targetChapterId = p?.chapterId || this.book.chapters?.[0]?.id;
    if (targetChapterId) {
      this.router.navigate(['/tabs/read', this.book.id, targetChapterId]);
    }
  }

  async onAddToList(): Promise<void> {
    if (!this.book) return;

    const modal = await this.modalController.create({
      component: ReadingListModalComponent,
      componentProps: {
        bookId: this.book.id,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.listId) {
      this.lists.addBookToList(data.listId, this.book.id);
    }
  }
}



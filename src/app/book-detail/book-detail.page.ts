import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { BookService, BookDetail } from '../services/book.service';
import { ReadingProgressService } from '../services/reading-progress.service';
import { ReadingListService, ReadingList } from '../services/reading-list.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: 'book-detail.page.html',
  styleUrls: ['book-detail.page.scss'],
  standalone: false,
})
export class BookDetailPage implements OnInit {
  book?: BookDetail;
  hasProgress = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly booksApi: BookService,
    private readonly progress: ReadingProgressService,
    private readonly listsService: ReadingListService,
    private readonly modalController: ModalController,
    private readonly toastController: ToastController,
    private readonly actionSheetController: ActionSheetController,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.booksApi.getBook(id).subscribe((b) => {
        this.book = b;
        this.checkProgress();
      });
    }
  }

  checkProgress(): void {
    if (!this.book) return;
    this.hasProgress = this.progress.hasProgress(this.book.id);
  }

  getReadButtonLabel(): string {
    return this.hasProgress ? 'Continuer la lecture' : 'Commencer à lire';
  }

  onReadClick(): void {
    if (!this.book) return;
    const currentBook = this.book;
    const progress = this.progress.getProgress(currentBook.id);
    // Preférer le chapitre sauvegardé, sinon le premier chapitre
    const targetChapterId = progress?.chapterId || currentBook.chapters?.[0]?.id;
    if (targetChapterId) {
      // Navigation vers la page de lecture (à créer si nécessaire)
      this.router.navigate(['/tabs/read', currentBook.id, targetChapterId]);
    }
  }

  async onAddToListClick(): Promise<void> {
    if (!this.book) return;

    const lists = this.listsService.getLists();

    if (lists.length === 0) {
      // Si aucune liste n'existe, proposer d'en créer une
      const name = await this.promptForListName();
      if (name) {
        const newList = this.listsService.createList(name);
        this.listsService.addBookToList(newList.id, this.book.id);
        this.showToast(`Livre ajouté à "${newList.name}"`);
      }
      return;
    }

    // Afficher une action sheet pour choisir une liste ou en créer une nouvelle
    const actionSheet = await this.actionSheetController.create({
      header: 'Ajouter à une liste',
      buttons: [
        ...lists.map(list => ({
          text: `${list.name} (${list.bookIds.length} livre${list.bookIds.length > 1 ? 's' : ''})`,
          handler: () => {
            this.listsService.addBookToList(list.id, this.book!.id);
            this.showToast(`Livre ajouté à "${list.name}"`);
          }
        })),
        {
          text: 'Créer une nouvelle liste',
          icon: 'add',
          handler: async () => {
            const name = await this.promptForListName();
            if (name) {
              const newList = this.listsService.createList(name);
              this.listsService.addBookToList(newList.id, this.book!.id);
              this.showToast(`Livre ajouté à "${newList.name}"`);
            }
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private async promptForListName(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = prompt('Nom de la nouvelle liste de lecture:');
      resolve(input);
    });
  }

  onChapterClick(chapterId: string | number): void {
    if (!this.book) return;
    this.router.navigate(['/tabs/read', this.book.id, chapterId]);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}



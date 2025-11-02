import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReadingListService, ReadingList } from '../../services/reading-list.service';

@Component({
  selector: 'app-reading-list-modal',
  templateUrl: './reading-list-modal.component.html',
  styleUrls: ['./reading-list-modal.component.scss'],
  standalone: false,
})
export class ReadingListModalComponent implements OnInit {
  lists: ReadingList[] = [];
  newListName = '';
  showCreateForm = false;

  constructor(
    private readonly modalController: ModalController,
    private readonly listsService: ReadingListService,
  ) {}

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.lists = this.listsService.getLists();
  }

  selectList(listId: string): void {
    this.modalController.dismiss({ listId });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.newListName = '';
    }
  }

  createAndSelectList(): void {
    if (!this.newListName.trim()) {
      return;
    }
    const newList = this.listsService.createList(this.newListName.trim());
    this.selectList(newList.id);
  }

  dismiss(): void {
    this.modalController.dismiss();
  }
}


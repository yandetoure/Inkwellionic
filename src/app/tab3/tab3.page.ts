import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReadingListService, ReadingList } from '../services/reading-list.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  lists: ReadingList[] = [];

  constructor(
    private readonly listsService: ReadingListService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadLists();
  }

  ionViewWillEnter(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.lists = this.listsService.getLists();
  }

  openList(listId: string): void {
    this.router.navigate(['/tabs/reading-list', listId]);
  }
}

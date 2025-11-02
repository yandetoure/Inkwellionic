import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookDetailPage } from './book-detail.page';
import { BookDetailPageRoutingModule } from './book-detail-routing.module';
import { ReadingListModalModule } from '../components/reading-list-modal/reading-list-modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BookDetailPageRoutingModule,
    ReadingListModalModule,
  ],
  declarations: [BookDetailPage]
})
export class BookDetailPageModule {}



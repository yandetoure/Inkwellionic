import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookDetailPage } from './book-detail.page';
import { BookDetailPageRoutingModule } from './book-detail-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BookDetailPageRoutingModule
  ],
  declarations: [BookDetailPage]
})
export class BookDetailPageModule {}



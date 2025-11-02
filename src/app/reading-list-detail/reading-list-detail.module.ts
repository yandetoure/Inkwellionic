import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReadingListDetailPage } from './reading-list-detail.page';
import { ReadingListDetailPageRoutingModule } from './reading-list-detail-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReadingListDetailPageRoutingModule,
  ],
  declarations: [ReadingListDetailPage]
})
export class ReadingListDetailPageModule {}


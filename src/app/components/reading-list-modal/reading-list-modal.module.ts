import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReadingListModalComponent } from './reading-list-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ReadingListModalComponent],
  exports: [ReadingListModalComponent],
})
export class ReadingListModalModule {}


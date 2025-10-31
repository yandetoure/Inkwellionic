import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReadPage } from './read.page';
import { ReadPageRoutingModule } from './read-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReadPageRoutingModule
  ],
  declarations: [ReadPage]
})
export class ReadPageModule {}



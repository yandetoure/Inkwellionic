import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadingListDetailPage } from './reading-list-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ReadingListDetailPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingListDetailPageRoutingModule {}


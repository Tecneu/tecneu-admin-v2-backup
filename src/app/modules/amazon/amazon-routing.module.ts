import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AmazonComponent} from "./amazon.component";
import {PaginatedItemListComponent} from "./components/paginated-item-list/paginated-item-list.component";


const routes: Routes = [
  {
    path: '',
    component: AmazonComponent,
    children: [
      {
        path: 'items',
        component: PaginatedItemListComponent,
      },

      {path: '', redirectTo: 'items', pathMatch: 'full'},
      {path: '**', redirectTo: 'items', pathMatch: 'full'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmazonRoutingModule {
}

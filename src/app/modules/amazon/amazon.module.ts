import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AmazonRoutingModule} from './amazon-routing.module';
import {PaginatedItemListComponent} from "./components/paginated-item-list/paginated-item-list.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    PaginatedItemListComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    AmazonRoutingModule
  ]
})
export class AmazonModule {
}

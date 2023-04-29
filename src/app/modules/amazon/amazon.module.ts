import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AmazonRoutingModule} from './amazon-routing.module';
import {PaginatedItemListComponent} from "./components/paginated-item-list/paginated-item-list.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {CustomPaginatorModule} from "../../shared/custom-paginator/custom-paginator.module";


@NgModule({
  declarations: [PaginatedItemListComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    CustomPaginatorModule,
    AmazonRoutingModule
  ]
})
export class AmazonModule {
}

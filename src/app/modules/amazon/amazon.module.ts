import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AmazonRoutingModule} from './amazon-routing.module';
import {PaginatedItemListComponent} from "./components/paginated-item-list/paginated-item-list.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {CustomPaginatorModule} from "../shared/components/custom-paginator/custom-paginator.module";
import {CdkTreeModule} from '@angular/cdk/tree';
import {TablesModule} from "../shared/components/tables/tables.module";

@NgModule({
  declarations: [PaginatedItemListComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    CdkTreeModule,
    CustomPaginatorModule,
    AmazonRoutingModule,
    TablesModule
  ]
})
export class AmazonModule {
}

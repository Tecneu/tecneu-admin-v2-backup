import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmazonRoutingModule } from './amazon-routing.module';
import {PaginatedItemListComponent} from "./components/paginated-item-list/paginated-item-list.component";


@NgModule({
  declarations: [
    PaginatedItemListComponent
  ],
  imports: [
    CommonModule,
    AmazonRoutingModule
  ]
})
export class AmazonModule { }

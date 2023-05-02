import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../../../_metronic/shared/shared.module";
import {ItemsTableComponent} from "./items-table/items-table.component";


@NgModule({
  declarations: [ItemsTableComponent],
  exports: [ItemsTableComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TablesModule {
}

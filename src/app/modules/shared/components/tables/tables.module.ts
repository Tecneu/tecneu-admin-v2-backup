import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../../../_metronic/shared/shared.module";
import {ProductsTableComponent} from "./products-table/products-table.component";


@NgModule({
  declarations: [ProductsTableComponent],
  exports: [ProductsTableComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TablesModule {
}

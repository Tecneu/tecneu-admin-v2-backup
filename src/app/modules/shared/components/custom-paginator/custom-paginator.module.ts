import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomPaginatorComponent} from "./custom-paginator.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [CustomPaginatorComponent],
  exports: [CustomPaginatorComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class CustomPaginatorModule {
}

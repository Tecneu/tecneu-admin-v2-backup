import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TecneuRoutingModule } from './tecneu-routing.module';
import { LocationsManagerComponent } from './components/locations-manager/locations-manager.component';


@NgModule({
  declarations: [
    LocationsManagerComponent
  ],
  imports: [
    CommonModule,
    TecneuRoutingModule
  ]
})
export class TecneuModule { }

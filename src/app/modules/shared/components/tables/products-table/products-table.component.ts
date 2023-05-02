import {Component, Input} from '@angular/core';
import {Product} from "../models/product.interface";

@Component({
  selector: 'app-items-table',
  templateUrl: './products-table.component.html'
})
export class ProductsTableComponent {
  @Input() products: Product[] = [];
}

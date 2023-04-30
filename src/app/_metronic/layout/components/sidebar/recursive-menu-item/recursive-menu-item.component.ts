import {Component, Input} from '@angular/core';
import {MenuItem} from "../../../../shared/menu/models/menu-item.interface";

@Component({
  selector: 'app-recursive-menu-item',
  templateUrl: './recursive-menu-item.component.html'
})
export class RecursiveMenuItemComponent {
  @Input() menuItem: MenuItem;
  @Input() depth: number;
}

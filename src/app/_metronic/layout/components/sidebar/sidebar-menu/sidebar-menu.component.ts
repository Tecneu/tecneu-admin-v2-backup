import {Component, OnInit} from '@angular/core';
import {MENU_ITEMS} from "../../../../shared/menu/data/menu-data";

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuItems = MENU_ITEMS;

  constructor() {
  }

  ngOnInit(): void {
  }

}

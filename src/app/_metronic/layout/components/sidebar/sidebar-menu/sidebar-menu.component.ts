import {Component, OnInit} from '@angular/core';
import {getMenuItems} from "../../../../shared/menu/data/menu-data";
import {TranslateService} from "@ngx-translate/core";
import {MenuItem} from "../../../../shared/menu/models/menu-item.interface";

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuItems: MenuItem[];

  constructor(private translateService: TranslateService) {
    this.menuItems = getMenuItems((key) => this.translateService.instant(key));
  }

  ngOnInit(): void {
  }

}

import {Component, Input} from '@angular/core';
import {Product} from "../models/product.interface";

@Component({
  selector: 'app-items-table',
  templateUrl: './products-table.component.html'
})
export class ProductsTableComponent {
  @Input() products: Product[] = [];

  formatPercent = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  getProfit(product: Product): { profit_percent: string; profit: string; color_of_profit: string; } {
    let profit = product.price - product.totalCostOfSales.commissionFee;
    const profit_percent = (profit / product.totalCostOfSales.COGS) - 1;
    profit -= product.totalCostOfSales.COGS;

    return {
      profit_percent: this.formatPercent.format(profit_percent),
      profit: this.formatCurrency.format(profit),
      color_of_profit: this.getColor(profit_percent),
    };
  }

  getColor(value: number) {
    // value from 0 to 1
    // tslint:disable-next-line:no-unused-expression
    value > 1 ? value = 1 : value < 0 ? value = 0 : undefined;
    value = 1 - value;
    // console.log('VALUE START');
    // console.log(value);
    const hue = ((1 - value) * 120).toString(10);
    // console.log(hue);
    // console.log('VALUE END');
    return ['hsl(', hue, ',60%,50%)'].join('');
  }
}

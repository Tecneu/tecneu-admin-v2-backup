import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService, UserType} from "../../../auth";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {FlatTreeControl} from '@angular/cdk/tree';
import {
  CostAndProfitsByProduct,
  IAmazonItem,
  Image,
  Image2,
  ItemsTreeDataInterface,
  Summary
} from "../../models/get-amazon-items.interface";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AmazonService} from "../../services/amazon.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ArrayUtilsService} from "../../../../services/array-utils.service";
import {ArrayDataSource} from "@angular/cdk/collections";
import {SyncResultsDialogComponent} from "../../../../shared/dialogs/sync-results-dialog/sync-results-dialog.component";

@Component({
  selector: 'app-paginated-item-list',
  templateUrl: './paginated-item-list.component.html',
  styleUrls: ['./paginated-item-list.component.scss']
})
export class PaginatedItemListComponent implements OnInit, OnDestroy {

  currentUser: UserType;
  isSpinnerVisible = true;
  isSpinnerOverlayVisible = false;

  options: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false);
  floatLabelControl = new UntypedFormControl('auto');

  treeControl = new FlatTreeControl<ItemsTreeDataInterface>(
    node => node.level, node => node.expandable);

  // dataSources: ArrayDataSource<ItemsTreeDataInterface>[] = [];
  dataSources: ArrayDataSource<ItemsTreeDataInterface>[] = [];
  itemsTreeData: ItemsTreeDataInterface[][] = [];
  limit = 100;
  offset = 0;
  total: number = 0;
  query: string;

  show_profit: boolean = false;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
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
  private unsubscribe: Subscription[] = []; // Read more: → https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(private amazonItemsService: AmazonService,
              private router: Router,
              fb: UntypedFormBuilder,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              // private scrollDispatcher: ScrollDispatcher,
              private arrayUtils: ArrayUtilsService,
              private authService: AuthService) {
    const subscr = this.authService.currentUser$.subscribe((user) => {
      if (!user) return;
      this.currentUser = user;
      this.show_profit = this.currentUser.permissions?.find(permission => permission.permission_name === 'tecneu_items')?.tags?.includes('show_profit') || false;
    });
    this.unsubscribe.push(subscr);

    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  hasChild = (_: number, node: ItemsTreeDataInterface) => node.expandable;

  getParentNode(dataSourceIndex: number, node: ItemsTreeDataInterface) {
    const nodeIndex = this.itemsTreeData[dataSourceIndex].indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (this.itemsTreeData[dataSourceIndex][i].level === node.level - 1) {
        return this.itemsTreeData[dataSourceIndex][i];
      }
    }

    return null;
  }

  shouldRender(dataSourceIndex: number, node: ItemsTreeDataInterface) {
    const parent = this.getParentNode(dataSourceIndex, node);
    return !parent || parent.isExpanded;
  }

  async ngOnInit() {
    // Quitar tooltips de botones de paginator
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';

    await this.getAndSetItems(this.offset, this.limit, undefined);
    this.isSpinnerVisible = false;
  }

  pageChangeEvent = async ($event: any) => {
    // console.log($event);
    const newPageSelected = $event.pageIndex;
    this.offset = newPageSelected * this.limit;

    this.isSpinnerOverlayVisible = true;
    if (this.query !== '' && this.query) {
      return this.search(this.query);
    }

    await this.getAndSetItems(this.offset, this.limit, undefined);
    this.isSpinnerOverlayVisible = false;
    // SCROLL TO TOP
    document.querySelector('mat-sidenav-content')?.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  };

  modifyItem(node: any) {
    this.router.navigateByUrl(`amazon/items/modificar/${node.item._id}`);
  }

  async search(query: string, newQuery?: boolean) {
    this.isSpinnerOverlayVisible = true;
    // console.log('SEARCH ITEMS');
    if (newQuery) {
      this.offset = 0;
      this.paginator.pageIndex = 0;
    }
    this.isSpinnerOverlayVisible = true;
    await this.getAndSetItems(this.offset, this.limit, query);
    this.isSpinnerOverlayVisible = false;
  }

  getAndSetItems(offset: number, limit: number, query: string | undefined) {
    return new Promise((resolve) => {
      this.amazonItemsService.getAmazonItems(offset, limit, query).subscribe(
        async (response) => {
          this.dataSources = [];
          this.itemsTreeData = [];

          this.total = response.paging.total;
          const allProducts = response.items_without_tecneu_item_relationships.concat(response.items_with_partial_tecneu_item_relationships, response.items);
          allProducts.forEach(product => {
            product.summaries = [product.summaries.find(summary => summary.marketplaceId === 'A1AM78C64UM0Y8') || {} as Summary];
            product.images = [product.images.find(images => images.marketplaceId === 'A1AM78C64UM0Y8') || {} as Image];

            const itemTreeData: ItemsTreeDataInterface[] = [{
              product,
              costs_and_profits: this.getCostsAndProfitsByProduct(product),
              level: 0,
              expandable: true,
            }];
            this.itemsTreeData.push(itemTreeData);
            this.dataSources.push(new ArrayDataSource(itemTreeData));
          });
          // console.log(response);
          resolve(response);
        },
        (err) => this.openSnackBar(err.messageError, 'Cerrar', 'notif-error'));
    });
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass
    });
  }

  clearQuery() {
    this.query = '';
    this.search(this.query, true);
  }

  updateAllItems() {
    this.isSpinnerOverlayVisible = true;
    this.amazonItemsService.updateAllAmazonItems().subscribe(
      async (response) => {
        this.dialog.open(SyncResultsDialogComponent, {
          width: '700px',
          data: response
        });
        this.isSpinnerOverlayVisible = false;
      },
      (err) => {
        this.isSpinnerOverlayVisible = false;
        this.openSnackBar(err.messageError, 'Cerrar', 'notif-error');
      });
  }

  getThumbMainImage(images: Image2[]): string {
    let thumbImage;
    if (images && images.length > 0) {
      const mainImages = images.filter(image => image.variant === 'MAIN');
      thumbImage = this.arrayUtils.hasMin(mainImages, 'height');
      // console.log(thumbImage.link);
    }
    return thumbImage?.link || '';
  }

  getCostsAndProfitsByProduct(item: IAmazonItem): CostAndProfitsByProduct {
    // console.log(item);
    let productCost = 0;
    // let product_price = 0;

    item?.tecneu_item_relationships?.forEach(relationship => {
      if (relationship.tecneu_item?.variations && relationship.tecneu_item?.variations.length > 0) {
        const variationCost = relationship.tecneu_item?.variations?.find(variation => String(variation._id) === String(relationship.tecneu_item_variation_id))?.cost || 0;
        productCost += (variationCost * relationship.quantity);
      } else {
        productCost += ((relationship?.tecneu_item?.cost || 0) * relationship.quantity);
      }
    });

    const item_price = item.buying_price?.listing_price?.amount;
    const seller_stock = item.fulfillment_availability?.quantity;

    // const free_shipping_cost = product.shipping.free_shipping ? product.selling_costs.free_shipping_cost : undefined;

    // let profit = product.price - (free_shipping_cost ? free_shipping_cost : 0) - product.selling_costs.sale_fee_amount;
    // const shipping = item.buying_price?.shipping?.amount ? item.buying_price?.shipping?.amount : 0;
    const total_fees = item.total_fees_estimate?.amount ? item.total_fees_estimate?.amount : 0;

    let profit = item_price - total_fees;
    const profit_percent = (profit / productCost) - 1;
    profit -= productCost;

    const percentageOfFeeAmount = Math.round((item.total_fees_estimate?.amount * 100) / item.buying_price?.landed_price?.amount);

    const objectReturn = {
      profit_percent: this.formatPercent.format(profit_percent),
      profit: this.formatCurrency.format(profit),
      color_of_profit: this.getColor(profit_percent),
      product_cost: this.formatCurrency.format(productCost),
      percentage_of_fee_amount: `${percentageOfFeeAmount}%`,
      sale_fee_amount: this.formatCurrency.format(item.total_fees_estimate?.amount),
      landed_price: this.formatCurrency.format(item.buying_price?.landed_price?.amount),
      shipping: this.formatCurrency.format(item.buying_price?.shipping?.amount),
      price: this.formatCurrency.format(item_price),
      available_quantity: seller_stock
    };
    // console.log(objectReturn);
    return objectReturn;
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

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    console.log(event);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../auth";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {IAmazonItem, Image, Image2, ItemsTreeDataInterface, Summary} from "../../models/get-amazon-items.interface";
import {MatPaginator} from "@angular/material/paginator";
import {AmazonService} from "../../services/amazon.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ArrayUtilsService} from "../../../../services/array-utils.service";
import {SyncResultsDialogComponent} from "../../../../shared/dialogs/sync-results-dialog/sync-results-dialog.component";
import {Product} from "../../../shared/components/tables/models/product.interface";

@Component({
  selector: 'app-paginated-item-list',
  templateUrl: './paginated-item-list.component.html',
  styleUrls: ['./paginated-item-list.component.scss']
})
export class PaginatedItemListComponent implements OnInit {
  isSpinnerVisible = true;
  isSpinnerOverlayVisible = false;

  options: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false);
  floatLabelControl = new UntypedFormControl('auto');
  products: Product[] = [];
  itemsTreeData: ItemsTreeDataInterface[][] = [];
  limit = 100;
  offset = 0;
  total: number = 0;
  query: string;

  show_profit: boolean = false;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private amazonItemsService: AmazonService,
              private router: Router,
              fb: UntypedFormBuilder,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private arrayUtils: ArrayUtilsService,
              private authService: AuthService,
              private changeDetector: ChangeDetectorRef) {
    this.show_profit = this.authService.currentUserValue?.hasPermission({
      permissionName: 'tecneu_items',
      tags: ['show_profit']
    }) ?? false;

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

  async ngOnInit() {
    await this.getAndSetItems(this.offset, this.limit, undefined);
    // this.isSpinnerVisible = false;
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
          this.products = [];
          this.itemsTreeData = [];

          this.total = response.paging.total;
          const allProducts = response.items_without_tecneu_item_relationships.concat(response.items_with_partial_tecneu_item_relationships, response.items);
          allProducts.forEach(product => {
            product.summaries = [product.summaries.find(summary => summary.marketplaceId === 'A1AM78C64UM0Y8') || {} as Summary];
            product.images = [product.images.find(images => images.marketplaceId === 'A1AM78C64UM0Y8') || {} as Image];

            console.log('quantity: ' + product.fulfillment_availability?.quantity);

            this.products.push({
              imageUrl: this.getThumbMainImage(product.images[0]?.images),
              productName: product.summaries[0]?.itemName,
              productId: product.asin,
              stock: product.fulfillment_availability?.quantity,
              price: product.buying_price?.listing_price?.amount,
              totalCostOfSales: {
                COGS: this.getProductCost(product),
                shippingFee: product.buying_price?.shipping?.amount,
                commissionFee: product.total_fees_estimate?.amount
              },
            });
          });
          // Agrega esta línea para indicarle a Angular que detecte los cambios
          this.changeDetector.detectChanges();
          resolve(response);
        },
        (err) => this.openSnackBar(err.messageError, 'Cerrar', 'notif-error'));
    });
  }

  getProductCost(item: IAmazonItem): number {
    let productCost = 0;

    item?.tecneu_item_relationships?.forEach(relationship => {
      if (relationship.tecneu_item?.variations && relationship.tecneu_item?.variations.length > 0) {
        const variationCost = relationship.tecneu_item?.variations?.find(variation => String(variation._id) === String(relationship.tecneu_item_variation_id))?.cost ?? 0;
        productCost += (variationCost * relationship.quantity);
      } else {
        const tecneuItemCost = relationship?.tecneu_item?.cost ?? 0;
        productCost += (tecneuItemCost * relationship.quantity);
      }
    });

    return productCost;
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

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    console.log(event);
  }
}

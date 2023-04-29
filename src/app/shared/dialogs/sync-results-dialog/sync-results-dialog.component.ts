import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IUpdateAllAmazonItems} from "../../../modules/amazon/models/get-amazon-items.interface";

@Component({
  selector: 'app-sync-results-dialog',
  templateUrl: './sync-results-dialog.component.html',
  styleUrls: ['./sync-results-dialog.component.scss']
})
export class SyncResultsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SyncResultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUpdateAllAmazonItems
  ) {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent implements OnInit, OnChanges {
  @Input() length: number = 250;
  @Input() pageSize: number = 50;
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  pageIndex = 0;
  pageNumbers: number[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.length || changes.pageSize) {
      this.calculateNumberOfPages();
    }
  }

  changePage(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.calculateNumberOfPages();
    this.pageChange.emit({pageIndex, pageSize: this.pageSize});
  }

  changePageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.calculateNumberOfPages();
    this.pageChange.emit({pageIndex: this.pageIndex, pageSize});
  }

  generateRange(start: number, end: number): number[] {
    return Array.from({length: end - start}, (_, i) => start + i);
  }

  calculateNumberOfPages(): number {
    const totalPages = Math.ceil(this.length / this.pageSize);
    this.pageNumbers = this.getVisiblePages(totalPages);
    return totalPages;
  }

  getVisiblePages(totalPages: number): number[] {
    const maxVisiblePages = 9;
    const visiblePages: number[] = [];

    if (totalPages <= maxVisiblePages) {
      return this.generateRange(0, totalPages);
    }

    let start = Math.max(0, Math.min(this.pageIndex - 4, totalPages - maxVisiblePages));

    if (this.pageIndex <= 4) {
      start = 0;
    }

    visiblePages.push(...this.generateRange(start, start + maxVisiblePages - 2));

    visiblePages.push(-1); // -1 represents '...'
    visiblePages.push(totalPages - 1);

    return visiblePages;
  }
}

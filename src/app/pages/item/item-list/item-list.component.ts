import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from '../../../services/item.service';
import { takeUntil } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { ListedItem } from '../models/listed-item.model';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-item-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  displayedColumns: string[] = ['name', 'supplierName', 'quantity', 'price', 'actions'];
  dataSource: MatTableDataSource<ListedItem>;
  private suppliers: Supplier[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private itemService: ItemService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private supplierService: SupplierService) { }

  ngOnInit(): void {
    combineLatest([
      this.itemService.items$.pipe(takeUntil(this.unsubscribe$)),
      this.supplierService.suppliers$.pipe(takeUntil(this.unsubscribe$))
    ]).subscribe(([items, suppliers]: [Item[], Supplier[]]) => {
      this.suppliers = suppliers;
      this.buildTable(items as ListedItem[]);
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private buildTable(items: ListedItem[]): void {
    items = items.map<ListedItem>((i: ListedItem) => {
      i.supplierName = this.getSupplierName(i as Item);
      return i;
    });
    this.dataSource = new MatTableDataSource<ListedItem>(items);
    this.dataSource.paginator = this.paginator;
  }

  onDelete(item: Item): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.itemService.deleteItem(item);
      }
    });
  }

  getSupplierName(item: Item): string {
    return (!!item.supplier) ? item.supplier.name : '';
  }
}

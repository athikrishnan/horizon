import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from '../../../services/item.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-item-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  displayedColumns: string[] = ['name', 'supplier', 'quantity', 'price', 'actions'];
  dataSource: MatTableDataSource<Item>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private itemService: ItemService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.itemService.items$.pipe(takeUntil(this.unsubscribe$)).subscribe((items: Item[]) => {
      this.buildTable(items);
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private buildTable(items: Item[]): void {
    this.dataSource = new MatTableDataSource<Item>(items);
    this.dataSource.paginator = this.paginator;
  }

  onDelete(item: Item): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.itemService.deleteItem(item);
      }
    });
  }
}

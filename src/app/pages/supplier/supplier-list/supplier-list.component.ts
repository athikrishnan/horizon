import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from '../supplier.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-supplier-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  displayedColumns: string[] = ['name', 'location', 'phone', 'email', 'actions'];
  dataSource: MatTableDataSource<Supplier>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private supplierService: SupplierService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.supplierService.suppliers$.pipe(takeUntil(this.unsubscribe$)).subscribe((suppliers: Supplier[]) => {
      this.buildTable(suppliers);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private buildTable(suppliers: Supplier[]): void {
    this.dataSource = new MatTableDataSource<Supplier>(suppliers);
    this.dataSource.paginator = this.paginator;
    this.ref.detectChanges();
  }

  onDelete(supplier: Supplier): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.supplierService.deleteSupplier(supplier);
      }
    });
  }
}

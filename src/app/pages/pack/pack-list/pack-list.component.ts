import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Pack } from 'src/app/models/pack.model';
import { PackService } from '../../../services/pack.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-pack-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pack-list.component.html',
  styleUrls: ['./pack-list.component.scss']
})
export class PackListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  displayedColumns: string[] = ['name', 'supplier', 'quantity', 'price', 'contains', 'actions'];
  dataSource: MatTableDataSource<Pack>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private packService: PackService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.packService.packs$.pipe(takeUntil(this.unsubscribe$)).subscribe((packs: Pack[]) => {
      this.buildTable(packs);
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private buildTable(packs: Pack[]): void {
    this.dataSource = new MatTableDataSource<Pack>(packs);
    this.dataSource.paginator = this.paginator;
  }

  onDelete(pack: Pack): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.packService.deletePack(pack);
      }
    });
  }
}

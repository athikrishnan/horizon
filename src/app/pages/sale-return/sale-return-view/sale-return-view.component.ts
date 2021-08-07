import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Customer } from 'src/app/models/customer.model';
import { SaleReturnItem } from 'src/app/models/sale-return-item.model';
import { SaleReturn } from 'src/app/models/sale-return.model';
import { SaleReturnService } from 'src/app/services/sale-return.service';
import { StateChangedService } from 'src/app/services/state-changed.service';
import { PickedProduct } from 'src/app/models/picked-product.model';

@Component({
  selector: 'app-sale-return-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sale-return-view.component.html',
  styleUrls: ['./sale-return-view.component.scss'],
  providers: [DecimalPipe]
})
export class SaleReturnViewComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  showProductSearch = false;
  saleReturn: SaleReturn;
  get customer(): Customer | null {
    return (!this.saleReturn) ? null : this.saleReturn.customer;
  }

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private saleReturnService: SaleReturnService,
    private dialog: MatDialog,
    private router: Router,
    private stateChangedService: StateChangedService<SaleReturn>) { }

  ngOnInit(): void {
    const saleReturnId: string = this.route.snapshot.paramMap.get('saleReturnId');
    this.saleReturnService.loadCurrentSaleReturn(saleReturnId).pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged((a, b) => a && b && a.updatedAt === b.updatedAt)
    ).subscribe((saleReturn: SaleReturn) => {
      this.saleReturn = saleReturn;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.saleReturnService.deleteSaleReturn(this.saleReturn).then(() => {
          this.router.navigate(['sale-return']);
        });
      }
    });
  }

  onProductSearchOpen(): void {
    this.showProductSearch = true;
  }

  onProductSearchCancel(): void {
    this.showProductSearch = false;
  }

  isIncompleteItem(item: SaleReturnItem): boolean {
    return !(!!item && !!item.product && !!item.variant
      && !!item.quantity && !!item.price);
  }

  onProductPick(pickedProduct: PickedProduct): void {
    this.showProductSearch = false;
    this.saleReturnService.saveSaleReturnItem(this.saleReturn, {
      product: pickedProduct.product,
      variant: pickedProduct.variant
    } as SaleReturnItem);
  }

  getTaxableAmount(): number {
    return this.saleReturn.total - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return this.saleReturn.totalCgst + this.saleReturn.totalSgst;
  }

  onComplete(): void {
    this.showSpinner = true;
    this.saleReturn.completedAt = Date.now();
    this.ref.detectChanges();
    this.stateChangedService.stateChanged(this.saleReturn);
    this.saleReturnService.completeSaleReturn(this.saleReturn).then(() => {
      this.ref.detectChanges();
      this.showSpinner = false;
    });
  }
}

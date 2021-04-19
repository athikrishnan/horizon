import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Supplier } from 'src/app/models/supplier.model';
import { PurchaseItem } from 'src/app/models/purchase-item.model';
import { Purchase } from 'src/app/models/purchase.model';
import { Product } from 'src/app/models/product.model';
import { PurchaseService } from 'src/app/services/purchase.service';
import { PurchaseStateService } from '../purchase-state.service';

@Component({
  selector: 'app-purchase-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss'],
  providers: [DecimalPipe]
})
export class PurchaseViewComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  showProductSearch = false;
  purchase: Purchase;
  get supplier(): Supplier | null {
    return (!this.purchase) ? null : this.purchase.supplier;
  }

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private dialog: MatDialog,
    private router: Router,
    private purchaseStateService: PurchaseStateService) { }

  ngOnInit(): void {
    const purchaseId: string = this.route.snapshot.paramMap.get('purchaseId');
    this.purchaseService.loadCurrentPurchase(purchaseId).pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged((a, b) => a && b && a.updatedAt === b.updatedAt)
    ).subscribe((purchase: Purchase) => {
      this.purchase = purchase;
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
        this.purchaseService.deletePurchase(this.purchase).then(() => {
          this.router.navigate(['purchase']);
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

  isIncompleteItem(item: PurchaseItem): boolean {
    return !(!!item && !!item.product && !!item.variant && !!item.pack
      && !!item.quantity && !!item.price);
  }

  onProductSelect(product: Product): void {
    this.showProductSearch = false;
    this.purchaseService.savePurchaseItem(this.purchase, {
      product,
    } as PurchaseItem);
  }

  getTaxableAmount(): number {
    return this.purchase.total - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return this.purchase.totalCgst + this.purchase.totalSgst;
  }

  onComplete(): void {
    this.showSpinner = true;
    this.purchase.completedAt = Date.now();
    this.ref.detectChanges();
    this.purchaseStateService.stateChanged(this.purchase);
    this.purchaseService.savePurchase(this.purchase).then(() => {
      this.ref.detectChanges();
      this.showSpinner = false;
    });
  }
}

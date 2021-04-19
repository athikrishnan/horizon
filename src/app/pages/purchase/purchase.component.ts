import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-purchase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  activePurchases: Purchase[] = [];
  recentPurchases: Purchase[] = [];

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private purchaseService: PurchaseService) { }

  ngOnInit(): void {
    combineLatest([
      this.purchaseService.getActivePurchases(),
      this.purchaseService.getRecentPurchases()
    ]).subscribe(([active, recent]: [Purchase[], Purchase[]]) => {
      this.activePurchases = active;
      this.recentPurchases = recent;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editPurchase(id: string): void {
    this.router.navigate(['purchase/' + id + '/view']);
  }
}

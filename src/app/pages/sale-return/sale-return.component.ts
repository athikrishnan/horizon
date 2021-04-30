import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { SaleReturn } from 'src/app/models/sale-return.model';
import { SaleReturnService } from 'src/app/services/sale-return.service';

@Component({
  selector: 'app-sale-return',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.scss']
})
export class SaleReturnComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  activeSaleReturns: SaleReturn[] = [];
  recentSaleReturns: SaleReturn[] = [];

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private saleReturnService: SaleReturnService) { }

  ngOnInit(): void {
    combineLatest([
      this.saleReturnService.getActiveSaleReturns(),
      this.saleReturnService.getRecentSaleReturns()
    ]).subscribe(([active, recent]: [SaleReturn[], SaleReturn[]]) => {
      this.activeSaleReturns = active;
      this.recentSaleReturns = recent;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editSaleReturn(id: string): void {
    this.router.navigate(['saleReturn/' + id + '/view']);
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  activeInvoices: Invoice[] = [];
  recentInvoices: Invoice[] = [];

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    combineLatest([
      this.invoiceService.getActiveInvoices(),
      this.invoiceService.getRecentInvoices()
    ]).subscribe(([active, recent]: [Invoice[], Invoice[]]) => {
      this.activeInvoices = active;
      this.recentInvoices = recent;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editInvoice(id: string): void {
    this.router.navigate(['invoice/' + id + '/view']);
  }
}

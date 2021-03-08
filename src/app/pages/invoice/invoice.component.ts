import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActiveInvoice } from 'src/app/models/active-invoice.model';
import { ActiveInvoiceService } from './active-invoice.service';

@Component({
  selector: 'app-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  activeInvoices: ActiveInvoice[] = [];

  constructor(
    private activeInvoiceService: ActiveInvoiceService,
    private router: Router,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activeInvoiceService.getActiveinvoices().pipe(takeUntil(this.unsubscribe$))
      .subscribe((activeInvoices: ActiveInvoice[]) => {
        this.activeInvoices = activeInvoices;
        this.showSpinner = false;
        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onNewInvoice(): void {
    this.showSpinner = true;
    this.activeInvoiceService.createNew().then((id: string) => {
      this.editInvoice(id);
    });
  }

  editInvoice(id: string): void {
    this.router.navigate(['invoice/active-invoice/' + id + '/client-selection']);
  }
}

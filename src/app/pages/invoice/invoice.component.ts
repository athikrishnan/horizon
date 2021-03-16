import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ActiveInvoice } from 'src/app/models/active-invoice.model';

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
    private router: Router,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showSpinner = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editInvoice(id: string): void {
    this.router.navigate(['invoice/' + id + '/view']);
  }
}

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
import { Customer } from 'src/app/models/customer.model';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';
import { Product } from 'src/app/models/product.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { InvoicePrintService } from '../invoice-print.service';
import { InvoicePrintComponent } from '../invoice-print/invoice-print.component';
import { InvoiceStateService } from '../invoice-state.service';

@Component({
  selector: 'app-invoice-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
  providers: [DecimalPipe]
})
export class InvoiceViewComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  showProductSearch = false;
  invoice: Invoice;
  get customer(): Customer | null {
    return (!this.invoice) ? null : this.invoice.customer;
  }
  @ViewChild(InvoicePrintComponent) print: InvoicePrintComponent;

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private router: Router,
    private invoiceStateService: InvoiceStateService,
    private invoicePrintService: InvoicePrintService) { }

  ngOnInit(): void {
    const invoiceId: string = this.route.snapshot.paramMap.get('invoiceId');
    this.invoiceService.loadCurrentInvoice(invoiceId).pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged((a, b) => a && b && a.updatedAt === b.updatedAt)
    ).subscribe((invoice: Invoice) => {
      this.invoice = invoice;
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
        this.invoiceService.deleteInvoice(this.invoice).then(() => {
          this.router.navigate(['invoice']);
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

  isIncompleteItem(item: InvoiceItem): boolean {
    return !(!!item && !!item.product && !!item.variant && !!item.pack
      && !!item.quantity && !!item.price);
  }

  onProductSelect(product: Product): void {
    this.showProductSearch = false;
    this.invoiceService.saveInvoiceItem(this.invoice, {
      product,
    } as InvoiceItem);
  }

  onTaxStateChange(event: MatCheckboxChange): void {
    this.showSpinner = true;
    this.invoice.hideTax = !event.checked;
    this.invoiceStateService.stateChanged(this.invoice);
    this.invoiceService.saveInvoice(this.invoice).then(() => {
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  getTaxableAmount(): number {
    return this.invoice.total - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return this.invoice.totalCgst + this.invoice.totalSgst;
  }

  onComplete(): void {
    this.showSpinner = true;
    this.invoice.completedAt = Date.now();
    this.invoiceStateService.stateChanged(this.invoice);
    this.invoiceService.saveInvoice(this.invoice).then(() => {
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onPrint(): void {
    this.invoicePrintService.print(this.invoice, this.print.content.nativeElement.innerHTML);
  }
}

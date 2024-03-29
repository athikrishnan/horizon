import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CompleteConfirmationComponent } from 'src/app/components/complete-confirmation/complete-confirmation.component';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Customer } from 'src/app/models/customer.model';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';
import { PickedProduct } from 'src/app/models/picked-product.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { StateChangedService } from 'src/app/services/state-changed.service';
import { InvoicePaymentComponent } from '../invoice-payment/invoice-payment.component';
import { InvoicePrintService } from '../invoice-print.service';
import { InvoicePrintComponent } from '../invoice-print/invoice-print.component';

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
  discountForm: FormGroup = this.fb.group({
    discount: [null, [Validators.required, Validators.min(0.01), Validators.max(100)]]
  });

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private router: Router,
    private stateChangedService: StateChangedService<Invoice>,
    private invoicePrintService: InvoicePrintService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const invoiceId: string = this.route.snapshot.paramMap.get('invoiceId');
    this.invoiceService.loadCurrentInvoice(invoiceId).pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged((a, b) => a && b && a.updatedAt === b.updatedAt)
    ).subscribe((invoice: Invoice) => {
      this.invoice = invoice;
      this.discountForm.patchValue({ discount: (this.invoice.discount || 0.01) });
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
    return !(!!item && !!item.product && !!item.variant
      && !!item.quantity && !!item.price);
  }

  onProductPick(pickedProduct: PickedProduct): void {
    this.showProductSearch = false;
    this.invoiceService.saveInvoiceItem(this.invoice, {
      product: pickedProduct.product,
      variant: pickedProduct.variant,
    } as InvoiceItem);
  }

  onTaxStateChange(event: MatCheckboxChange): void {
    this.showSpinner = true;
    this.invoice.hideTax = !event.checked;
    this.stateChangedService.stateChanged(this.invoice);
    this.saveInvoice();
  }

  private saveInvoice(): void {
    this.invoiceService.saveInvoice(this.invoice).then(() => {
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onDiscountStateChange(event: MatCheckboxChange): void {
    this.showSpinner = true;
    this.invoice.hasDiscount = event.checked;
    this.invoice.discount = (event.checked) ? (this.customer.discount || 0.01) : null;
    this.ref.detectChanges();
    if (this.invoice.hasDiscount) {
      this.discountForm.patchValue({ discount: (this.customer.discount || 0.01) });
    }
    this.saveInvoice();
  }

  onSaveDiscount(): void {
    this.showSpinner = true;
    this.invoice.discount = +this.discountForm.get('discount').value;
    this.saveInvoice();
  }

  getTaxableAmount(): number {
    return this.invoice.total - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return this.invoice.totalCgst + this.invoice.totalSgst;
  }

  onComplete(): void {
    this.dialog.open(CompleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.invoice.completedAt = Date.now();
        this.ref.detectChanges();
        this.stateChangedService.stateChanged(this.invoice);
        this.invoiceService.completeInvoice(this.invoice).then(() => {
          this.ref.detectChanges();
          this.showSpinner = false;
        });
      }
    });
  }

  onPrint(): void {
    this.invoicePrintService.print(this.invoice, this.print.content.nativeElement.innerHTML);
  }

  onAddPayment(): void {
    this.dialog.open(InvoicePaymentComponent, {
      data: this.invoice
    }).afterClosed().subscribe(() => {
      this.ref.detectChanges();
    });
  }

  displayDate(date: any): string {
    const day = dayjs(date.toDate());
    return day.format('ddd, MMM D, YYYY');
  }

  canComplete(): boolean {
    return this.invoice && !this.invoice.completedAt && this.invoice.items && this.invoice.items.length > 0
      && !this.invoice.items.find(item => this.isIncompleteItem(item));
  }
}

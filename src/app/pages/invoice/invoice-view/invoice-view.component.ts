import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Customer } from 'src/app/models/customer.model';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invoice-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  invoice: Invoice;
  get customer(): Customer | null {
    return (!this.invoice) ? null : this.invoice.customer;
  }

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    const invoiceId: string = this.route.snapshot.paramMap.get('invoiceId');
    this.invoiceService.loadCurrentInvoice(invoiceId).pipe(takeUntil(this.unsubscribe$))
      .subscribe((invoice: Invoice) => {
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
}

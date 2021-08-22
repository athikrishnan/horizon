import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Customer } from 'src/app/models/customer.model';
import { Invoice } from 'src/app/models/invoice.model';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { CustomerDiscountComponent } from '../customer-discount/customer-discount.component';

@Component({
  selector: 'app-customer-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {
  showSpinner = true;
  customerId: string;
  customer: Customer;
  activeInvoices: Invoice[] = [];

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    combineLatest([
      this.customerService.getCustomer(this.customerId),
      this.invoiceService.getActiveInvoicesForCustomer(this.customerId)
    ]).subscribe(([customer, invoices]: [Customer, Invoice[]]) => {
      this.customer = customer;
      this.activeInvoices = invoices;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.customerService.deleteCustomer(this.customer).then(() => {
          this.alertService.alert('Customer deleted');
          this.router.navigate(['customer']);
        });
      }
    });
  }

  onSetDiscount(): void {
    this.dialog.open(CustomerDiscountComponent, { data: this.customer }).afterClosed()
      .subscribe((customer: Customer) => {
        this.customer = customer;
        this.ref.detectChanges();
      });
  }

  onCreateInvoice(): void {
    this.showSpinner = true;
    // TODO: introduce date selection
    this.invoiceService.createInvoiceForCustomer(this.customer, new Date()).then((invoiceId: string) => {
      this.alertService.alert('Invoice created');
      this.router.navigate(['invoice/' + invoiceId + '/view']);
    });
  }

  gotoInvoice(invoice: Invoice): void {
    this.router.navigate(['invoice/' + invoice.id + '/view']);
  }
}

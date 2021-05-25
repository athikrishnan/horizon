import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Customer } from 'src/app/models/customer.model';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';
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

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.customerService.getCustomer(this.customerId).subscribe((customer: Customer) => {
      this.customer = customer;
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
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { ProformaService } from 'src/app/services/proforma.service';

@Component({
  selector: 'app-new-proforma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-proforma.component.html',
  styleUrls: ['./new-proforma.component.scss']
})
export class NewProformaComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  results: Customer[];
  customer: Customer;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private ref: ChangeDetectorRef,
    private proformaService: ProformaService,
    private router: Router) { }

  ngOnInit(): void {
    this.showSpinner = false;
    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.customerService.searchCustomersByName(value).subscribe((results: Customer[]) => {
        this.results = results;
        this.ref.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCustomerSelect(customer: Customer): void {
    this.customer = customer;
  }

  onChangeCustomer(): void {
    this.customer = undefined;
  }

  onCreateProforma(customer: Customer): void {
    this.showSpinner = true;
    this.proformaService.createProformaForCustomer(customer).then((proformaId: string) => {
      this.router.navigate(['proforma/' + proformaId + '/view']);
    });
  }
}

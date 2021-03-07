import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  companyForm: FormGroup = this.fb.group({
    id: ['1'],
    name: [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [{ value: 'Tamilnadu', disabled: true }],
      country: [{ value: 'India', disabled: true }],
      zip: ['']
    }),
    phone: [''],
    email: [''],
    pan: [''],
    gstin: [''],
    currency: [{ value: 'INR', disabled: 'true' }]
  });

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.companyService.companies$.pipe(takeUntil(this.unsubscribe$)).subscribe((companies: Company[]) => {
      if (companies.length > 0) {
        this.companyForm.patchValue(companies[0]);
        this.companyForm.markAsPristine();
      }
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSave(): void {
    this.showSpinner = true;
    const company: Company = this.companyForm.getRawValue() as Company;
    this.companyService.saveCompany(company).then(() => {
      this.companyForm.markAsPristine();
      this.showSpinner = false;
    });
  }
}

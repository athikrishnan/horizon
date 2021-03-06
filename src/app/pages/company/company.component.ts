import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
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
    private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.companies$.subscribe((companies: Company[]) => {
      if (companies.length > 0) {
        this.companyForm.patchValue(companies[0]);
        this.showSpinner = false;
      }
    });
  }

  onSave(): void {
    const company: Company = this.companyForm.getRawValue() as Company;
    this.companyService.saveCompany(company);
  }
}

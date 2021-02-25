import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup = this.fb.group({
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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }
}

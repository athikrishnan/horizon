import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNewInvoiceComponent } from './customer-new-invoice.component';

describe('CustomerNewInvoiceComponent', () => {
  let component: CustomerNewInvoiceComponent;
  let fixture: ComponentFixture<CustomerNewInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerNewInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerNewInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

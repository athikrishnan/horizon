import { TestBed } from '@angular/core/testing';

import { ActiveInvoiceService } from './active-invoice.service';

describe('ActiveInvoiceService', () => {
  let service: ActiveInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

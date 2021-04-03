import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemFormComponent } from './invoice-item-form.component';

describe('InvoiceItemFormComponent', () => {
  let component: InvoiceItemFormComponent;
  let fixture: ComponentFixture<InvoiceItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceItemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

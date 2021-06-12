import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { InvoiceService } from 'src/app/services/invoice.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockDashboardService = jasmine.createSpyObj('DashboardService', ['todaysReport', 'activeInvoices']);
  mockDashboardService.todaysReport.and.returnValue(of([]));
  mockDashboardService.activeInvoices.and.returnValue(of([]));
  const mockTransactionService = jasmine.createSpyObj('TransactionService', ['getTransactionsByDate']);
  const mockInvoiceService = jasmine.createSpyObj('InvoiceService', ['getActiveInvoices']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        MaterialModule
      ],
      declarations: [ DashboardComponent ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: InvoiceService, useValue: mockInvoiceService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

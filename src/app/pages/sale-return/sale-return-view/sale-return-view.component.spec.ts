import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnViewComponent } from './sale-return-view.component';

describe('SaleReturnViewComponent', () => {
  let component: SaleReturnViewComponent;
  let fixture: ComponentFixture<SaleReturnViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

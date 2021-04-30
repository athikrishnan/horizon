import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnItemComponent } from './sale-return-item.component';

describe('SaleReturnItemComponent', () => {
  let component: SaleReturnItemComponent;
  let fixture: ComponentFixture<SaleReturnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

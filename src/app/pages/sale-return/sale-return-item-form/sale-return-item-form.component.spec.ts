import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnItemFormComponent } from './sale-return-item-form.component';

describe('SaleReturnItemFormComponent', () => {
  let component: SaleReturnItemFormComponent;
  let fixture: ComponentFixture<SaleReturnItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnItemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

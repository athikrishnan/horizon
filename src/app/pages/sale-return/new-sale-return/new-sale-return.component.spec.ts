import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSaleReturnComponent } from './new-sale-return.component';

describe('NewSaleReturnComponent', () => {
  let component: NewSaleReturnComponent;
  let fixture: ComponentFixture<NewSaleReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSaleReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

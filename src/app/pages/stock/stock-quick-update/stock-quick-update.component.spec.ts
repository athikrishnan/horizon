import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockQuickUpdateComponent } from './stock-quick-update.component';

describe('StockQuickUpdateComponent', () => {
  let component: StockQuickUpdateComponent;
  let fixture: ComponentFixture<StockQuickUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockQuickUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockQuickUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeFinderComponent } from './income-finder.component';

describe('IncomeFinderComponent', () => {
  let component: IncomeFinderComponent;
  let fixture: ComponentFixture<IncomeFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

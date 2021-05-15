import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFinderComponent } from './expense-finder.component';

describe('ExpenseFinderComponent', () => {
  let component: ExpenseFinderComponent;
  let fixture: ComponentFixture<ExpenseFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

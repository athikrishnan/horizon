import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteConfirmationComponent } from './complete-confirmation.component';

describe('CompleteConfirmationComponent', () => {
  let component: CompleteConfirmationComponent;
  let fixture: ComponentFixture<CompleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

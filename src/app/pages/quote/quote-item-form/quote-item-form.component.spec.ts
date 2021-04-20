import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteItemFormComponent } from './quote-item-form.component';

describe('QuoteItemFormComponent', () => {
  let component: QuoteItemFormComponent;
  let fixture: ComponentFixture<QuoteItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteItemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

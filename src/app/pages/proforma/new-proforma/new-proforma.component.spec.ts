import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProformaComponent } from './new-proforma.component';

describe('NewProformaComponent', () => {
  let component: NewProformaComponent;
  let fixture: ComponentFixture<NewProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProformaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

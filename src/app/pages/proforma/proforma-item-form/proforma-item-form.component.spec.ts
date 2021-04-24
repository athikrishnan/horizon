import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaItemFormComponent } from './proforma-item-form.component';

describe('ProformaItemFormComponent', () => {
  let component: ProformaItemFormComponent;
  let fixture: ComponentFixture<ProformaItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaItemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

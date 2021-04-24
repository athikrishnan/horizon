import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaItemComponent } from './proforma-item.component';

describe('ProformaItemComponent', () => {
  let component: ProformaItemComponent;
  let fixture: ComponentFixture<ProformaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

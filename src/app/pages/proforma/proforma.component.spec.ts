import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaComponent } from './proforma.component';

describe('ProformaComponent', () => {
  let component: ProformaComponent;
  let fixture: ComponentFixture<ProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

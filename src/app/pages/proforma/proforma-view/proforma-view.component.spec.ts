import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaViewComponent } from './proforma-view.component';

describe('ProformaViewComponent', () => {
  let component: ProformaViewComponent;
  let fixture: ComponentFixture<ProformaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

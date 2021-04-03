import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabFormComponent } from './slab-form.component';

describe('SlabFormComponent', () => {
  let component: SlabFormComponent;
  let fixture: ComponentFixture<SlabFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

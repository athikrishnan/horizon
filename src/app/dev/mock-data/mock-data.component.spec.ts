import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDataComponent } from './mock-data.component';

describe('MockDataComponent', () => {
  let component: MockDataComponent;
  let fixture: ComponentFixture<MockDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

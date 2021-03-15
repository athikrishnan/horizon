import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantFormComponent } from './product-variant-form.component';

describe('ProductVariantFormComponent', () => {
  let component: ProductVariantFormComponent;
  let fixture: ComponentFixture<ProductVariantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVariantFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

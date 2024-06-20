import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchBrandComponent } from './product-search-brand.component';

describe('ProductSearchBrandComponent', () => {
  let component: ProductSearchBrandComponent;
  let fixture: ComponentFixture<ProductSearchBrandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSearchBrandComponent]
    });
    fixture = TestBed.createComponent(ProductSearchBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

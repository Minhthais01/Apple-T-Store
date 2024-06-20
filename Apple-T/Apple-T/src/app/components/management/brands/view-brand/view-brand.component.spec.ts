import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBrandComponent } from './view-brand.component';

describe('ViewBrandComponent', () => {
  let component: ViewBrandComponent;
  let fixture: ComponentFixture<ViewBrandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBrandComponent]
    });
    fixture = TestBed.createComponent(ViewBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

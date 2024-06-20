import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticProductTableComponent } from './statistic-product-table.component';

describe('StatisticProductTableComponent', () => {
  let component: StatisticProductTableComponent;
  let fixture: ComponentFixture<StatisticProductTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticProductTableComponent]
    });
    fixture = TestBed.createComponent(StatisticProductTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

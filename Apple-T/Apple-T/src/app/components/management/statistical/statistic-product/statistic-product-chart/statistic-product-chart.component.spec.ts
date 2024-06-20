import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticProductChartComponent } from './statistic-product-chart.component';

describe('StatisticProductChartComponent', () => {
  let component: StatisticProductChartComponent;
  let fixture: ComponentFixture<StatisticProductChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticProductChartComponent]
    });
    fixture = TestBed.createComponent(StatisticProductChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

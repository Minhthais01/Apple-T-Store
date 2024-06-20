import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticByMonthChartComponent } from './statistic-by-month-chart.component';

describe('StatisticByMonthChartComponent', () => {
  let component: StatisticByMonthChartComponent;
  let fixture: ComponentFixture<StatisticByMonthChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticByMonthChartComponent]
    });
    fixture = TestBed.createComponent(StatisticByMonthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

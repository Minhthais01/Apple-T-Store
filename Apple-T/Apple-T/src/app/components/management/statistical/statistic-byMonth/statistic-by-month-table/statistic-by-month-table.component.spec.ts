import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticByMonthTableComponent } from './statistic-by-month-table.component';

describe('StatisticByMonthTableComponent', () => {
  let component: StatisticByMonthTableComponent;
  let fixture: ComponentFixture<StatisticByMonthTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticByMonthTableComponent]
    });
    fixture = TestBed.createComponent(StatisticByMonthTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

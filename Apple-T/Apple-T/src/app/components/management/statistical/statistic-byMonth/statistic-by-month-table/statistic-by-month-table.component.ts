import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistic-by-month-table',
  templateUrl: './statistic-by-month-table.component.html',
  styleUrls: ['./statistic-by-month-table.component.css']
})
export class StatisticByMonthTableComponent {
  statisticsForm: FormGroup;
  statisticsData : any;

  pageSize = 6;
  currentPage = 1;
  
  public total_quantity:number = 0
  public total_revenue:number = 0
  public total_order:number = 0

  margin: number = 0;
  display1: string = 'none'
  display2: string = 'block'

  constructor(private formBuilder: FormBuilder, private statisticsService: StatisticsService) {
    this.statisticsForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
    });
  }

  toggleMenu1() {
    this.margin = 0;
    this.display1 = 'none'
    this.display2 = 'block'

}

toggleMenu2() {
  this.margin = -15;
  this.display2 = 'none'
  this.display1 = 'block'
}

  onSubmit() {
    if (!this.statisticsForm.value.fromDate) {
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0]; 
      this.statisticsForm.patchValue({ fromDate: currentDateString });
    }
    if (!this.statisticsForm.value.toDate) {
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0]; 
      this.statisticsForm.patchValue({ toDate: currentDateString });
    }


    const fromDate = this.statisticsForm.value.fromDate;
    const toDate = this.statisticsForm.value.toDate;
    this.statisticsService.getStatistics(fromDate, toDate).subscribe(data => {
      this.statisticsData = data; 
    });

    this.statisticsService.getStatistics_byMonth(fromDate, toDate).subscribe(data => {
      this.total_quantity = data.total_quantity
      this.total_revenue = data.total_revenue
      this.total_order = data.total_order
    });
  }
}

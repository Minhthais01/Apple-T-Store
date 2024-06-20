import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistic-by-month-chart',
  templateUrl: './statistic-by-month-chart.component.html',
  styleUrls: ['./statistic-by-month-chart.component.css']
})
export class StatisticByMonthChartComponent {
  statisticsForm: FormGroup;
  statisticsData : any;

  isToggled: boolean = true;
  barChart: any;
  lstStatistic: any = [];
  lstProduct: any = [];
  lstNumberSold: any = [];

  margin: number = 0;
  display1: string = 'none'
  display2: string = 'block'

  displayBarChart: string = 'block';

  constructor(
    private formBuilder: FormBuilder, private statisticServices: StatisticsService
  ){
    this.statisticsForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
    });
  }

  toggleMenu() {
    this.isToggled = !this.isToggled;
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

  ngOnInit() {
    this.statistic_chart();
  };

  

  statistic_chart() {
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
    
    this.statisticServices.getStatistics(fromDate, toDate).subscribe(data => {
      this.lstStatistic = data;
      this.lstProduct = []; 
      this.lstNumberSold = [];
  
      
      this.lstStatistic.forEach((item: { productName: string; number_sold: number }) => {
        this.lstProduct.push(item.productName);
        this.lstNumberSold.push(item.number_sold);
      });
  
      
      if (this.barChart) {
        this.barChart.destroy();
      }
      
      
      this.BarChart();
    });
  }
  
  BarChart() {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.lstProduct,
        datasets: [
          {
            label: 'Product',
            data: this.lstNumberSold,
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgb(255, 99, 132)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

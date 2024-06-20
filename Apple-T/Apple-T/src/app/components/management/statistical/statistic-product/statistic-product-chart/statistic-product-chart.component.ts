import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatisticsService } from 'src/app/services/statistics.service';
Chart.register(...registerables)
@Component({
  selector: 'app-statistic-product-chart',
  templateUrl: './statistic-product-chart.component.html',
  styleUrls: ['./statistic-product-chart.component.css']
})
export class StatisticProductChartComponent {
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
    private statisticServices: StatisticsService
  ){}

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

    statistic_chart(){
      this.statisticServices.getPro_Statistics_Chart().subscribe((res)=>{
        this.lstStatistic = res;
        this.lstStatistic.forEach(
          (item: {productName: any; number_sold: any}) => {
            this.lstProduct.push(item.productName),
            this.lstNumberSold.push(item.number_sold);
          }
        );
        this.BarChart()
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

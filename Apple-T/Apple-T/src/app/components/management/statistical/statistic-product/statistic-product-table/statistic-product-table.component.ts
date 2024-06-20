import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistic-product-table',
  templateUrl: './statistic-product-table.component.html',
  styleUrls: ['./statistic-product-table.component.css']
})
export class StatisticProductTableComponent implements OnInit {
  public lstPro_Sta: any = [];
  public lstTotal_Sta: any = [];
  isToggled: boolean = true;
  public sortOrder: string = 'desc';
  public total_quantity:number = 0
  public total_revenue:number = 0
  public total_order:number = 0
  margin: number = 0;
  display1: string = 'none'
  display2: string = 'block'


  pageSize = 6;
  currentPage = 1;

  constructor(
      private api: StatisticsService,
      private toast: ToastrService,
  ) { }

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

  ngOnInit(): void {
    this.viewPro_Sta();
    this.viewTotal_Sta();
  }
  

  changeSortOrder(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue) {
        this.sortOrder = selectedValue;
        this.viewPro_Sta();
    }
}

  viewPro_Sta() {
      this.api.getPro_Statistics(this.sortOrder).subscribe(data => {
          this.lstPro_Sta = data;
      });
  }

  viewTotal_Sta(){
    this.api.getTotal_Statistic().subscribe(data => {
      this.total_quantity = data.total_quantity
      this.total_revenue = data.total_revenue
      this.total_order = data.total_order
    });
  }
}

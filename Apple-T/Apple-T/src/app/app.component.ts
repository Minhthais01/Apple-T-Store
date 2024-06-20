import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShowService } from './services/show.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isShow:boolean = false
  private subscription!: Subscription;
  constructor(private show:ShowService){}

  ngOnInit() {
    setTimeout(() => { this.ngOnInit() }, 0);
    if(window.location.href == "http://localhost:4200/Statistic-Product-Table"){
      this.isShow = false;
    }
    else if(window.location.href == "http://localhost:4200/Statistic-Product-Chart"){
      this.isShow = false;
    }
    else if(window.location.href == "http://localhost:4200/Statistic-byMonth-Chart"){
      this.isShow = false;
    }
    else if(window.location.href == "http://localhost:4200/Statistic-byMonth-Table"){
      this.isShow = false;
    }
    else{
      this.isShow = true;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  Show(): void {
    this.show.triggerLoad();
  }
}

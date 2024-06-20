import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor() { }


  private triggerTestFunction = new Subject<void>();

  testFunctionTriggered$ = this.triggerTestFunction.asObservable();

  triggerLoad(): void {
    this.triggerTestFunction.next();
  }
}

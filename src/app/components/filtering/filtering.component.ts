import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilteringDataService } from '../../filtering-data.service';
import { first, Subscription } from 'rxjs';

@Component({
  selector: 'filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.scss']
})
export class FilteringComponent implements OnInit, OnDestroy {

  public isMonthly = false;
  public start = new Date();
  public end = new Date();

  private subscription: Subscription | undefined;

  constructor( private filteringData: FilteringDataService ) {
  }

  ngOnInit(): void {
    this.subscription = this.filteringData.asObservable().pipe(first()).subscribe(( data ) => {
      this.isMonthly = data.isMonthly;
      this.start = data.startDate;
      this.end = data.endDate;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public updateMonthly() {
    this.filteringData.setIsMonthly(this.isMonthly);
  }

  public updateStart(event: any) {
    this.filteringData.setStartDate(new Date(event.target.value));
  }

  public updateEnd(event: any) {
    this.filteringData.setEndDate(new Date(event.target.value));
  }
}

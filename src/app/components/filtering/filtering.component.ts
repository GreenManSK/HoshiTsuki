import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataPackage, FilteringDataService } from '../../filtering-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.scss']
})
export class FilteringComponent implements OnInit, OnDestroy {
  public data?: DataPackage;

  private subscription: Subscription | undefined;

  constructor( private filteringData: FilteringDataService ) {
  }

  ngOnInit(): void {
    this.subscription = this.filteringData.asObservable().subscribe(( data ) => {
      this.data = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public updateMonthly() {
    this.filteringData.setIsMonthly(this.data?.isMonthly || true);
  }

  public updateStart() {
    this.filteringData.setStartDate(this.data?.startDate || new Date());
  }

  public updateEnd() {
    this.filteringData.setEndDate(this.data?.endDate || new Date());
  }
}

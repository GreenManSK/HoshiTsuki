import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './services/data.service';

export type DataPackage = {
  isMonthly: boolean;
  startDate: Date;
  endDate: Date;
};

@Injectable({
  providedIn: 'root'
})
export class FilteringDataService {

  private isMonthly = false;
  private startDate: Date;
  private endDate: Date;
  private subject: BehaviorSubject<DataPackage>;

  constructor(dataService: DataService) {
    this.endDate = new Date();
    this.startDate = dataService.getFirstInvestment();
    this.subject = new BehaviorSubject<DataPackage>(this.getData());
  }

  public getData(): DataPackage {
    return {
      isMonthly: this.isMonthly,
      startDate: this.startDate,
      endDate: this.endDate
    };
  }

  public asObservable() {
    return this.subject.asObservable();
  }

  public setIsMonthly( value: boolean ) {
    this.isMonthly = value;
    this.subject.next(this.getData());
  }

  public setStartDate( date: Date ) {
    this.startDate = date;
    this.subject.next(this.getData());
  }

  public setEndDate( date: Date ) {
    this.endDate = date;
    this.subject.next(this.getData());
  }
}

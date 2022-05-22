import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ChartDataBag } from '../../types/ChartDataBag';
import { formatDate } from '@angular/common';

type ChartPoint = { name: string, value: number };

type ChartLine = {
  name: string,
  series: ChartPoint[]
};

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  public chartData: ChartLine[] = [];

  private _isMonthly: boolean = false;
  private _data?: Map<string, ChartDataBag[]>;
  private _valueFunction: ( bag: ChartDataBag ) => number = ( bag ) => bag.volume * bag.unitPrice;
  view: [number, number] = [700, 400];

  constructor( @Inject(LOCALE_ID) public locale: string ) {
  }

  ngOnInit(): void {
  }

  @Input('isMonthly')
  set isMonthly( value: boolean ) {
    this._isMonthly = value;
    this.computeChart();
  }

  @Input('valueFunction')
  set valueFunction( value: ( bag: ChartDataBag ) => number ) {
    this._valueFunction = value;
    this.computeChart();
  }

  @Input('data')
  set data( value: Map<string, ChartDataBag[]> ) {
    this._data = value;
    this.computeChart();
  }

  private computeChart() {
    if (!this._data || !this._valueFunction) {
      return;
    }
    const data = [] as ChartLine[];
    for (const symbol of this._data.keys()) {
      const dataBags = this._data.get(symbol) || [];
      const series = dataBags
        .filter(( bag, key ) => !this._isMonthly || (key === dataBags.length - 1 || this.isLastDayOfMonth(bag.date)))
        .map(bag => ({
          name: this._isMonthly ? formatDate(bag.date, 'MMM y', this.locale) : formatDate(bag.date, 'd.M.y', this.locale),
          value: this._valueFunction(bag)
        }));
      const firstNonzeroIndex = series.findIndex(point => point.value !== 0);
      series.splice(0, firstNonzeroIndex);
      data.push({
        name: symbol,
        series
      });
    }
    this.chartData = data;
  }

  private isLastDayOfMonth( date: Date ): boolean {
    const test = new Date(date.getTime()),
      month = test.getMonth();
    test.setDate(test.getDate() + 1);
    return test.getMonth() !== month;
  }
}

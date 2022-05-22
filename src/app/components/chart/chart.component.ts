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

  @Input()
  public showSum = true;

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
    const sumMap = new Map<string, [number, number]>();
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
      series.forEach(point => {
        const [count, sum] = sumMap.get(point.name) ?? [0,0];
        sumMap.set(point.name, [count + 1, sum + point.value]);
      })
      data.push({
        name: symbol,
        series
      });
    }

    if (this.showSum && this._data.size > 1) {
      data.push({
        name: 'Total',
        series: Array.from(sumMap.keys())
          .filter(key => (sumMap.get(key) ?? [0,0])[0] === data.length)
          .map(key => ({
          name: key,
          value: (sumMap.get(key) ?? [0,0])[1]
        }))
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

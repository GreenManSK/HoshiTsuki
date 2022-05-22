import { Component } from '@angular/core';
import { multi } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  multi: any[];
  yAxisLabel: string = 'Population';
  xAxisLabel: string = 'Years';
  view: [number,number] = [700, 400];
  showXAxis = true;
  showYAxis = true;

  title = 'HoshiTsuki';

  constructor() {
    this.multi = multi;
  }
}

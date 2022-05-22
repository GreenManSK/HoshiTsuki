import { Component } from '@angular/core';
import { multi } from './data';
import { DataService } from './services/data.service';

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

  constructor(dataService: DataService) {
    this.multi = multi;
  }
}

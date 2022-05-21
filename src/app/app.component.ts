import { Component } from '@angular/core';
import { read as readXLSX } from 'xlsx';
import { SheetParserService } from './services/sheet-parser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HoshiTsuki';

  constructor( private sheetParser: SheetParserService ) {
  }

  public previewImage( event: any ) {
    const reader = new FileReader();
    reader.onload = ( e: any ) => {
      const workbook = readXLSX(e.target.result, {
        type: 'binary'
      });
      console.log('workbook', workbook);
      console.log('crypt', this.sheetParser.parseCrypto(workbook));
      console.log('stocks', this.sheetParser.parseStocks(workbook));
      console.log('work', this.sheetParser.parseWorkStocks(workbook));
    };
    reader.readAsBinaryString(event.target.files[0]);
  }
}

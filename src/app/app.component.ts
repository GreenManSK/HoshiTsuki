import { Component } from '@angular/core';
import { read as readXLSX } from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HoshiTsuki';

  public previewImage( event: any ) {
    const reader = new FileReader();
    reader.onload = ( e: any ) => {
      console.log('workbook', readXLSX(e.target.result, {
        type: 'binary'
      }));
    };
    reader.readAsBinaryString(event.target.files[0]);
  }
}

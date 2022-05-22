import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { read as readXLSX } from 'xlsx';
import { SheetParserService } from '../../services/sheet-parser.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'sheet-uploader',
  templateUrl: './sheet-uploader.component.html',
  styleUrls: ['./sheet-uploader.component.scss']
})
export class SheetUploaderComponent implements OnInit {

  private static readonly SHEET_DATA_KEY = 'sheet';

  public lastEdit: Date | undefined;

  constructor(
    private localStorageService: LocalStorageService,
    private sheetParser: SheetParserService,
    private dataService: DataService
  ) {
    this.updateLastEdit();
  }

  ngOnInit(): void {
  }

  public uploadSheet( event: any ) {
    if (!event?.target?.files?.length) {
      return;
    }
    const reader = new FileReader();
    reader.onload = ( e: any ) => {
      try {
        const workbook = readXLSX(e.target.result, {
          type: 'binary'
        });
        this.localStorageService.set(SheetUploaderComponent.SHEET_DATA_KEY, 1);
        this.dataService.setData(
          this.sheetParser.parseCrypto(workbook),
          this.sheetParser.parseStocks(workbook),
          this.sheetParser.parseWorkStocks(workbook),
        );
        this.updateLastEdit();
      } catch (e: any) {
        console.error('Invalid file');
      }
    };
    reader.readAsBinaryString(event.target.files[0]);
  }

  private updateLastEdit() {
    this.lastEdit = this.localStorageService.getEditTime(SheetUploaderComponent.SHEET_DATA_KEY);
  }

}

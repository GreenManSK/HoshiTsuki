import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { read as readXLSX } from 'xlsx';
import { SheetParserService } from '../../services/sheet-parser.service';

@Component({
  selector: 'sheet-uploader',
  templateUrl: './sheet-uploader.component.html',
  styleUrls: ['./sheet-uploader.component.scss']
})
export class SheetUploaderComponent implements OnInit {

  public static readonly CRYPTO_DATA_KEY = 'cryto';
  public static readonly STOCKS_DATA_KEY = 'stocks';
  public static readonly WORK_STOCKS_DATA_KEY = 'work';
  private static readonly SHEET_DATA_KEY = 'sheet';

  public lastEdit: Date | undefined;

  constructor( private localStorageService: LocalStorageService, private sheetParser: SheetParserService ) {
    this.lastEdit = localStorageService.getEditTime(SheetUploaderComponent.SHEET_DATA_KEY);
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
        this.localStorageService.set(SheetUploaderComponent.CRYPTO_DATA_KEY, this.sheetParser.parseCrypto(workbook));
        this.localStorageService.set(SheetUploaderComponent.STOCKS_DATA_KEY, this.sheetParser.parseStocks(workbook));
        this.localStorageService.set(SheetUploaderComponent.WORK_STOCKS_DATA_KEY, this.sheetParser.parseWorkStocks(workbook));
      } catch (e: any) {
        console.error('Invalid file');
      }
    };
    reader.readAsBinaryString(event.target.files[0]);
  }

}

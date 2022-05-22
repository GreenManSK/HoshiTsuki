import { Injectable } from '@angular/core';
import { WorkBook } from 'xlsx';
import { Crypto } from '../types/Crypto';
import { CryptoStaking } from '../types/CryptoStaking';
import { Stock } from '../types/Stock';
import { Dividend } from '../types/Dividend';
import { WorkStock } from '../types/WorkStock';

@Injectable({
  providedIn: 'root'
})
export class SheetParserService {

  private static readonly CRYPTO_SHEET = 'Crypto';
  private static readonly STOCKS_SHEET = 'Stocks';
  private static readonly WORK_STOCKS_SHEET = 'Work Stocks';

  constructor() {
  }

  public parseCrypto( workBook: WorkBook ): { investments: Crypto[], stakings: CryptoStaking[] } {
    if (!workBook.SheetNames.includes(SheetParserService.CRYPTO_SHEET)) {
      throw new Error('Invalid workbook');
    }
    const sheet = workBook.Sheets[SheetParserService.CRYPTO_SHEET];
    const investments = [] as Crypto[];
    const stakings = [] as CryptoStaking[];

    // Get BTC
    for (let i = 3; sheet[`A${i}`] !== undefined && Number.isInteger(sheet[`A${i}`].v); i++) {
      investments.push(new Crypto(
        'BTC',
        this.parseDate(sheet[`A${i}`].w),
        sheet[`B${i}`].v,
        sheet[`C${i}`].v,
        sheet[`E${i}`].v,
      ))
    }

    // Get ETH
    for (let i = 3; sheet[`I${i}`] !== undefined && Number.isInteger(sheet[`I${i}`].v); i++) {
      investments.push(new Crypto(
        'ETH',
        this.parseDate(sheet[`I${i}`].w),
        sheet[`J${i}`].v,
        sheet[`K${i}`].v,
        sheet[`M${i}`].v,
      ))
    }

    // Get ETH staking
    for (let i = 3; sheet[`Q${i}`] !== undefined && Number.isInteger(sheet[`Q${i}`].v); i++) {
      stakings.push(new CryptoStaking(
        'ETH',
        this.parseDate(sheet[`Q${i}`].w),
        sheet[`R${i}`].v,
      ));
    }

    return {investments, stakings};
  }

  public parseStocks( workbook: WorkBook ): { investments: Stock[], dividends: Dividend[] } {
    if (!workbook.SheetNames.includes(SheetParserService.STOCKS_SHEET)) {
      throw new Error('Invalid workbook');
    }
    const investments = [] as Stock[];
    const dividends = [] as Dividend[];
    const sheet = workbook.Sheets[SheetParserService.STOCKS_SHEET];

    let i = 3;
    for (; sheet[`A${i}`] !== undefined && Number.isInteger(sheet[`A${i}`].v); i++) {
      investments.push(new Stock(
        sheet[`C${i}`].v,
        this.parseDate(sheet[`A${i}`].w),
        sheet[`D${i}`].v,
        sheet[`F${i}`].v,
        sheet[`E${i}`].v,
      ));
    }

    for (; sheet[`A${i}`] === undefined || !Number.isInteger(sheet[`A${i}`].v); i++) {
    }

    for (; sheet[`A${i}`] !== undefined && Number.isInteger(sheet[`A${i}`].v); i++) {
      dividends.push(new Dividend(
        sheet[`C${i}`].v,
        this.parseDate(sheet[`A${i}`].w),
        sheet[`F${i}`].v,
        sheet[`E${i}`].v,
        sheet[`D${i}`].v,
      ));
    }

    return {investments, dividends};
  }

  public parseWorkStocks( workbook: WorkBook ): { investments: WorkStock[], dividends: Dividend[] } {
    if (!workbook.SheetNames.includes(SheetParserService.WORK_STOCKS_SHEET)) {
      throw new Error('Invalid workbook');
    }
    const investments = [] as WorkStock[];
    const dividends = [] as Dividend[];
    const sheet = workbook.Sheets[SheetParserService.WORK_STOCKS_SHEET];

    let i = 3;
    for (; sheet[`A${i}`] !== undefined && Number.isInteger(sheet[`A${i}`].v); i++) {
      investments.push(new WorkStock(
        sheet[`C${i}`].v,
        this.parseDate(sheet[`A${i}`].w),
        sheet[`D${i}`].v,
        0,
        0,
        sheet[`H${i}`].v,
        sheet[`G${i}`].v,
      ));
    }

    for (; sheet[`A${i}`] === undefined || !Number.isInteger(sheet[`A${i}`].v); i++) {
    }

    for (; sheet[`A${i}`] !== undefined && Number.isInteger(sheet[`A${i}`].v); i++) {
      dividends.push(new Dividend(
        sheet[`C${i}`].v,
        this.parseDate(sheet[`A${i}`].w),
        sheet[`F${i}`].v,
        sheet[`E${i}`].v,
        sheet[`D${i}`].v,
      ));
    }
    return {investments, dividends};
  }

  private parseDate( stringDate: string ) {
    let date: Date;
    if (stringDate.includes('.')) {
      const parts = stringDate.split('.');
      date = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    } else {
      const parts = stringDate.split('/');
      date = new Date(2000 + +parts[2], +parts[0] - 1, +parts[1]);
    }
    return date;
  }
}

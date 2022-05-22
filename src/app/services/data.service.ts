import { Injectable } from '@angular/core';
import { Crypto } from '../types/Crypto';
import { CryptoStaking } from '../types/CryptoStaking';
import { Stock } from '../types/Stock';
import { Dividend } from '../types/Dividend';
import { WorkStock } from '../types/WorkStock';
import { LocalStorageService } from './local-storage.service';

type StockData = { investments: Stock[], dividends: Dividend[] };
type WorkStockData = { investments: WorkStock[], dividends: Dividend[] };
type CrpytoData = { investments: Crypto[], stakings: CryptoStaking[] };

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public static readonly CRYPTO_DATA_KEY = 'cryto';
  public static readonly STOCKS_DATA_KEY = 'stocks';
  public static readonly WORK_STOCKS_DATA_KEY = 'work';

  constructor( private localStorageService: LocalStorageService ) {
  }

  public setData(
    crypto: CrpytoData,
    stocks: StockData,
    work: WorkStockData
  ) {
    this.localStorageService.set(DataService.CRYPTO_DATA_KEY, crypto);
    this.localStorageService.set(DataService.STOCKS_DATA_KEY, stocks);
    this.localStorageService.set(DataService.WORK_STOCKS_DATA_KEY, work);
  }

  public getStockSymbols(): string[] {
    const symbols = new Set<string>();
    this.getStocks().investments.forEach(stock => symbols.add(stock.name));
    this.getWorkStocks().investments.forEach(stock => symbols.add(stock.name));
    return Array.from(symbols);
  }

  public getCryptoSymbols() {
    const symbols = new Set<string>();
    this.getCrypto().investments.forEach(crypto => symbols.add(crypto.name));
    return Array.from(symbols);
  }

  private getCrypto() {
    return this.localStorageService.get<CrpytoData>(DataService.CRYPTO_DATA_KEY, {investments: [], stakings: []});
  }

  private getStocks() {
    return this.localStorageService.get<StockData>(DataService.STOCKS_DATA_KEY, {investments: [], dividends: []});
  }

  private getWorkStocks() {
    return this.localStorageService.get<WorkStockData>(DataService.WORK_STOCKS_DATA_KEY, {
      investments: [],
      dividends: []
    });
  }
}

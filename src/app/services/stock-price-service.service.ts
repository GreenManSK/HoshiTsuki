import { Injectable } from '@angular/core';
import * as alphavantage from 'alphavantage';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

type HistoryRecord = {
  date: Date,
  price: number
}

@Injectable({
  providedIn: 'root'
})
export class StockPriceServiceService {
  private static readonly DELAY = 61 * 1000;

  private alpha: any;

  constructor( private localStorageService: LocalStorageService ) {
    this.alpha = alphavantage({key: environment.alphavantage});
  }

  public getHistory( symbol: string ): HistoryRecord[] {
    return this.localStorageService.get<HistoryRecord[]>(this.getStorageKey(symbol), []);
  }

  public loadStockData( symbol: string ) {
    return this.alpha.data.daily(symbol, 'full').then(( data: any ) => {
      const daily = data['Time Series (Daily)'];
      const mappedPrices = Object.keys(daily).map(( key ) => ({
        date: new Date(key),
        price: +(daily[key]['4. close'] || daily[key]['1. open'])
      }));
      this.localStorageService.set(this.getStorageKey(symbol), mappedPrices);
      return mappedPrices;
    });
  }

  public loadStocks( symbols: string[], onProgress: ( done: number ) => void ): Promise<void> {
    return new Promise<void>(( resolve ) => {
      let current = 0;
      const step = () => {
        onProgress(current);
        this.loadStockData(symbols[current]).then(() => {
          current++;
          if (current === symbols.length) {
            resolve();
            return;
          }
          step();
        }).catch(async () => {
          console.log("Waiting...");
          await new Promise(resolve => setTimeout(resolve, StockPriceServiceService.DELAY));
          step();
        });
      };
      step();
    });
  }

  private getStorageKey( symbol: string ) {
    return `stock_${symbol}`;
  }
}

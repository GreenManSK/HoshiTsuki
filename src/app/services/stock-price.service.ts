import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { AAphaVantagePriceService } from './aapha-vantage-price.service';

type HistoryRecord = {
  date: Date,
  price: number
}

@Injectable({
  providedIn: 'root'
})
export class StockPriceService extends AAphaVantagePriceService {

  constructor( localStorageService: LocalStorageService ) {
    super(localStorageService);
  }

  public loadPriceData( symbol: string ) {
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

  protected getStorageKey( symbol: string ) {
    return `stock_${symbol}`;
  }
}

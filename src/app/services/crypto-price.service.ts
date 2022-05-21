import { Injectable } from '@angular/core';
import { AAphaVantagePriceService } from './aapha-vantage-price.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoPriceService extends AAphaVantagePriceService {

  private static readonly CURRENCY = 'eur';

  constructor( localStorageService: LocalStorageService ) {
    super(localStorageService);
  }

  public loadPriceData( symbol: string ) {
    return this.alpha.crypto.daily(symbol, CryptoPriceService.CURRENCY).then(( data: any ) => {
      const daily = data['Time Series (Digital Currency Daily)'];
      const mappedPrices = Object.keys(daily).map(( key ) => ({
        date: new Date(key),
        price: +(daily[key]['4a. close (EUR)'] || daily[key]['1a. open (EUR)'])
      }));
      this.localStorageService.set(this.getStorageKey(symbol), mappedPrices);
      return mappedPrices;
    });
  }

  protected getStorageKey( symbol: string ) {
    return `crypto_${symbol}`;
  }

}

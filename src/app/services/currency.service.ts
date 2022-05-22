import { Injectable } from '@angular/core';
import * as alphavantage from 'alphavantage';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  protected alpha: any;

  constructor(private localStorageService: LocalStorageService) {
    this.alpha = alphavantage({key: environment.alphavantage});
  }

  public loadRate(from: string, to = 'usd') {
    return this.alpha.forex.rate(from, to).then((data: any) => {
      const rate = +data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
      this.localStorageService.set(this.getKey(from, to), rate);
    });
  }

  public getRate(from: string, to = 'usd'): number {
    return this.localStorageService.get(this.getKey(from, to), 0);
  }

  private getKey(from: string, to: string) {
    return `currency_${from}_${to}`;
  }
}

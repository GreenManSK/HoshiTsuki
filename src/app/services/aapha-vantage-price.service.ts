import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import * as alphavantage from 'alphavantage';
import { environment } from '../../environments/environment';

export type HistoryRecord = {
  date: Date,
  price: number
}

@Injectable({
  providedIn: 'root'
})
export abstract class AAphaVantagePriceService {

  private static readonly DELAY = 61 * 1000;

  protected alpha: any;

  constructor( protected localStorageService: LocalStorageService ) {
    this.alpha = alphavantage({key: environment.alphavantage});
  }

  public loadPrices( symbols: string[], onProgress: ( done: number ) => void ): Promise<void> {
    return new Promise<void>(( resolve ) => {
      let current = 0;
      const step = () => {
        onProgress(current);
        this.loadPriceData(symbols[current]).then(() => {
          current++;
          if (current === symbols.length) {
            resolve();
            return;
          }
          step();
        }).catch(async () => {
          console.log('Waiting...');
          await new Promise(resolve => setTimeout(resolve, AAphaVantagePriceService.DELAY));
          step();
        });
      };
      step();
    });
  }

  protected abstract getStorageKey( symbol: string ): string;

  protected abstract loadPriceData( string: string ): Promise<HistoryRecord[]>;
}

import { Injectable } from '@angular/core';
import { Crypto } from '../types/Crypto';
import { CryptoStaking } from '../types/CryptoStaking';
import { Stock } from '../types/Stock';
import { Dividend } from '../types/Dividend';
import { WorkStock } from '../types/WorkStock';
import { LocalStorageService } from './local-storage.service';
import { ChartDataBag } from '../types/ChartDataBag';
import { CryptoPriceService } from './crypto-price.service';
import { HistoryRecord } from './aapha-vantage-price.service';
import { StockPriceService } from './stock-price.service';

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

  constructor(
    private localStorageService: LocalStorageService,
    private cryptoPriceService: CryptoPriceService,
    private stockPriceService: StockPriceService
  ) {
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

  public getFirstInvestment(): Date {
    let first = new Date();
    this.getCrypto().investments.forEach(crypto => {
      if (first > crypto.date) {
        first = crypto.date;
      }
    })
    this.getStocks().investments.forEach(crypto => {
      if (first > crypto.date) {
        first = crypto.date;
      }
    })
    this.getWorkStocks().investments.forEach(crypto => {
      if (first > crypto.date) {
        first = crypto.date;
      }
    })
    return first;
  }

  public getCryptoChartDataBags( start: Date, end: Date ) {
    const {investments} = this.getCrypto();
    return this.getDataBags(investments, start, end, ( symbol: string ) => this.cryptoPriceService.getPrices(symbol));
  }

  public getCryptoStakingChartDataBags( start: Date, end: Date ) {
    const {stakings} = this.getCrypto();
    const investments = stakings.map(staking => new Crypto(staking.name, staking.date, staking.volume, 0, 0));
    return this.getDataBags(investments, start, end, ( symbol: string ) => this.cryptoPriceService.getPrices(symbol));
  }

  public getStockChartDataBags( start: Date, end: Date ) {
    const {investments} = this.getStocks();
    return this.getDataBags(investments, start, end, ( symbol: string ) => this.stockPriceService.getPrices(symbol));
  }

  public getStockDividendChartDataBags( start: Date, end: Date ) {
    const {dividends} = this.getStocks();
    const investments = dividends.map(dividend => new Stock(dividend.name, dividend.date, dividend.amount, dividend.tax, dividend.taxCzk))
    return this.getDataBags(investments, start, end, ( symbol: string ) => this.stockPriceService.getPrices(symbol));
  }

  public getWorkStockChartDataBags( start: Date, end: Date ) {
    const {investments} = this.getWorkStocks();
    return this.getDataBags(investments, start, end, ( symbol: string ) => this.stockPriceService.getPrices(symbol));
  }

  public getWorkStockDividendChartDataBags( start: Date, end: Date ) {
    const {dividends} = this.getWorkStocks();
    const investments = dividends.map(dividend => new Stock(dividend.name, dividend.date, dividend.amount, dividend.tax, dividend.taxCzk))
    console.log(dividends, investments);
    return this.getDataBags(investments, start, end, ( symbol: string ) => this.stockPriceService.getPrices(symbol));
  }

  public getDataBags(
    investments: Crypto[] | Stock[] | WorkStock[],
    start: Date,
    end: Date,
    getPrices: ( symbol: string ) => HistoryRecord[]
  ): Map<string, ChartDataBag[]> {
    const result = new Map<string, ChartDataBag[]>();
    const symbols = new Set(investments.map(c => c.name));
    symbols.forEach(symbol => {
      const bags = [] as ChartDataBag[];
      // @ts-ignore
      const currentInvestments = investments.filter(c => c.name === symbol && c.date <= end).sort(( a, b ) => a.date <= b.date ? -1 : 1);
      const prices = getPrices(symbol).filter(p => start <= p.date && p.date <= end);

      let pivot = 0;
      let lastBag = {
        date: new Date(),
        volume: 0,
        unitPrice: 0,
        buyPrice: 0
      };
      for (const price of prices) {
        let newVolume = 0;
        let newBuyPrice = 0;
        for (; pivot < currentInvestments.length && currentInvestments[pivot].date <= price.date; pivot++) {
          newVolume = currentInvestments[pivot].volume;
          newBuyPrice = currentInvestments[pivot].buyPrice || currentInvestments[pivot].price || currentInvestments[pivot].tax;
        }
        lastBag = {
          date: price.date,
          unitPrice: price.price,
          volume: lastBag.volume + newVolume,
          buyPrice: lastBag.buyPrice + newBuyPrice
        };
        bags.push(lastBag);
      }

      result.set(symbol, bags);
    });
    return result;
  }

  private getCrypto() {
    const result = this.localStorageService.get<CrpytoData>(DataService.CRYPTO_DATA_KEY, {
      investments: [],
      stakings: []
    });
    result.investments.forEach(i => {
      i.date = new Date(i.date);
    });
    result.stakings.forEach(i => {
      i.date = new Date(i.date);
    });
    return result;
  }

  private getStocks() {
    const result = this.localStorageService.get<StockData>(DataService.STOCKS_DATA_KEY, {
      investments: [],
      dividends: []
    });
    result.investments.forEach(i => {
      i.date = new Date(i.date);
    });
    result.dividends.forEach(i => {
      i.date = new Date(i.date);
    });
    return result;
  }

  private getWorkStocks() {
    const result = this.localStorageService.get<WorkStockData>(DataService.WORK_STOCKS_DATA_KEY, {
      investments: [],
      dividends: []
    });
    result.investments.forEach(i => {
      i.date = new Date(i.date);
    });
    result.dividends.forEach(i => {
      i.date = new Date(i.date);
    });
    return result;
  }
}

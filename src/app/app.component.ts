import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { ChartDataBag } from './types/ChartDataBag';
import { FilteringDataService } from './filtering-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HoshiTsuki';

  public cryptoData?: Map<string, ChartDataBag[]>;
  public cryptoStakingData?: Map<string, ChartDataBag[]>;

  public workData?: Map<string, ChartDataBag[]>;
  public workDividendData?: Map<string, ChartDataBag[]>;

  public stockData?: Map<string, ChartDataBag[]>;
  public stockDividendData?: Map<string, ChartDataBag[]>;

  public combinedData?: Map<string, ChartDataBag[]>;

  public profitFunction = ( bag: ChartDataBag ) => bag.volume * bag.unitPrice - bag.buyPrice;
  public dividendFunction = ( bag: ChartDataBag ) => bag.volume - bag.buyPrice;
  public stakingFunction = ( bag: ChartDataBag ) => bag.volume * bag.unitPrice - bag.buyPrice;
  public isMonthly = false;

  private isSummaryProfitGood = false;
  private isStockProfitGood = false;
  private isCryptoProfitGood = false;
  private isWorkProfitGood = false;

  public summaryImageClass1 = '';
  public summaryImageClass2 = '';
  public stockImageClass = '';
  public cryptoImageClass = '';
  public workImageClass = '';

  constructor( private dataService: DataService, private filteringDataService: FilteringDataService ) {
    filteringDataService.asObservable().subscribe(data => {
      this.isMonthly = data.isMonthly;
      this.createData(data.startDate, data.endDate);
    });
  }

  private createData( startDate: Date, endDate: Date ) {
    this.cryptoData = this.dataService.getCryptoChartDataBags(startDate, endDate);
    this.cryptoStakingData = this.dataService.getCryptoStakingChartDataBags(startDate, endDate);

    this.workData = this.dataService.getWorkStockChartDataBags(startDate, endDate);
    this.workDividendData = this.dataService.getWorkStockDividendChartDataBags(startDate, endDate);

    this.stockData = this.dataService.getStockChartDataBags(startDate, endDate);
    this.stockDividendData = this.dataService.getStockDividendChartDataBags(startDate, endDate);

    this.createCombinedData();
  }

  private createCombinedData() {
    const combinedData = new Map<string, ChartDataBag[]>();

    // crypto
    const cryptoData = [] as ChartDataBag[];
    const cryptoValues = Array.from(this.cryptoData?.values() || [])
    const cryptoStakingValues = Array.from(this.cryptoStakingData?.values() || []);

    for (let i = 0; cryptoValues.length > 0 && i < cryptoValues[0].length || 0; i++) {
      const baseBag = {
        date: cryptoValues[0][i].date,
        volume: 0,
        unitPrice: 1,
        buyPrice: 0
      };
      for (let j = 0; j < cryptoValues.length; j++) {
        baseBag.volume += cryptoValues[j][i].volume * cryptoValues[j][i].unitPrice;
        baseBag.buyPrice += cryptoValues[j][i].buyPrice;
      }
      for (let j = 0; j < cryptoStakingValues.length; j++) {
        baseBag.volume += cryptoStakingValues[j][i].volume * cryptoStakingValues[j][i].unitPrice;
      }
      cryptoData.push(baseBag);
    }
    combinedData.set('Crypto', cryptoData);

    // work
    const workData = [] as ChartDataBag[];
    const workValues = Array.from(this.workData?.values() || [])
    const workDividendsValues = Array.from(this.workDividendData?.values() || []);

    for (let i = 0; workValues.length > 0 && i < workValues[0].length || 0; i++) {
      const baseBag = {
        date: workValues[0][i].date,
        volume: 0,
        unitPrice: 1,
        buyPrice: 0
      };
      for (let j = 0; j < workValues.length; j++) {
        baseBag.volume += workValues[j][i].volume * workValues[j][i].unitPrice;
        baseBag.buyPrice += workValues[j][i].buyPrice;
      }
      for (let j = 0; j < workDividendsValues.length; j++) {
        baseBag.volume += workDividendsValues[j][i].volume;
        baseBag.buyPrice += workDividendsValues[j][i].buyPrice;
      }
      workData.push(baseBag);
    }
    combinedData.set('Work', workData);

    // stock
    const stockData = [] as ChartDataBag[];
    const stockValues = Array.from(this.stockData?.values() || [])
    const stockDividendsValues = Array.from(this.stockDividendData?.values() || []);

    for (let i = 0; stockValues.length > 0 && i < stockValues[0].length || 0; i++) {
      const baseBag = {
        date: stockValues[0][i].date,
        volume: 0,
        unitPrice: 1,
        buyPrice: 0
      };
      for (let j = 0; j < stockValues.length; j++) {
        baseBag.volume += stockValues[j][i].volume * stockValues[j][i].unitPrice;
        baseBag.buyPrice += stockValues[j][i].buyPrice;
      }
      for (let j = 0; j < stockDividendsValues.length; j++) {
        baseBag.volume += stockDividendsValues[j][i].volume;
        baseBag.buyPrice += stockDividendsValues[j][i].buyPrice;
      }
      stockData.push(baseBag);
    }
    combinedData.set('Stock', stockData);

    this.combinedData = combinedData;
  }

  public refresh() {
    location.reload();
  }

  public setSummaryGood( data: number ) {
    this.isSummaryProfitGood = data > 0;
    this.setImageClasses();
  }

  public setStockGood( data: number ) {
    this.isStockProfitGood = data > 0;
    this.setImageClasses();
  }

  public setCryptoGood( data: number ) {
    this.isCryptoProfitGood = data > 0;
    this.setImageClasses();
  }

  public setWorkGood( data: number ) {
    this.isWorkProfitGood = data > 0;
    this.setImageClasses();
  }

  public setImageClasses() {
    const happy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    happy.sort(() => Math.random() > 0.5 ? 1 : -1);
    const sad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    sad.sort(() => Math.random() > 0.5 ? 1 : -1);

    this.summaryImageClass1 = this.getImageClass(this.isSummaryProfitGood, happy, sad);
    this.summaryImageClass2 = this.getImageClass(this.isSummaryProfitGood, happy, sad);
    this.stockImageClass = this.getImageClass(this.isStockProfitGood, happy, sad);
    this.cryptoImageClass = this.getImageClass(this.isCryptoProfitGood, happy, sad);
    this.workImageClass = this.getImageClass(this.isWorkProfitGood, happy, sad);
  }

  private getImageClass( isHappy: boolean, happy: number[], sad: number[] ) {
    return `image ${isHappy ? 'happy' : 'sad'} i${(isHappy ? happy : sad).pop()}`;
  }
}

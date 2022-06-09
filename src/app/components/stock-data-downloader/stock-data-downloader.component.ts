import { Component, OnInit } from '@angular/core';
import { StockPriceService } from '../../services/stock-price.service';
import { CryptoPriceService } from '../../services/crypto-price.service';
import { DataService } from '../../services/data.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'stock-data-downloader',
  templateUrl: './stock-data-downloader.component.html',
  styleUrls: ['./stock-data-downloader.component.scss']
})
export class StockDataDownloaderComponent implements OnInit {

  public progress = false;
  public done = 0;
  public all = 0;

  constructor(
    private stockPriceService: StockPriceService,
    private cryptoPriceService: CryptoPriceService,
    private dataService: DataService,
    private currencyService: CurrencyService
  ) {
  }

  ngOnInit(): void {
  }

  public reloadData( $event: MouseEvent ) {
    $event.preventDefault();
    this.progress = true;
    const stocks = this.dataService.getStockSymbols();
    const crypto = this.dataService.getCryptoSymbols();
    this.all = stocks.length + crypto.length;
    this.currencyService.loadRate('eur').then(() => {
      this.stockPriceService.loadPrices(stocks, ( done ) => this.done = done).then(() => {
        this.cryptoPriceService.loadPrices(crypto, ( done ) => this.done = done + stocks.length)
          .then(() => {
            this.progress = false;
            location.reload();
          });
      });
    });
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SheetUploaderComponent } from './components/sheet-uploader/sheet-uploader.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockDataDownloaderComponent } from './components/stock-data-downloader/stock-data-downloader.component';

@NgModule({
  declarations: [
    AppComponent,
    SheetUploaderComponent,
    StockDataDownloaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

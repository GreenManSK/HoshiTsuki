import { Stock } from './Stock';

export class WorkStock extends Stock {

  constructor(
    name: string, date: Date, volume: number, price: number, priceCzk: number,
    public tax: number,
    public taxCzk: number
  ) {
    super(name, date, volume, price, priceCzk);
  }
}

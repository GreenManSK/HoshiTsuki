export class Stock {
  constructor(
    public name: string,
    public date: Date,
    public volume: number,
    public price: number,
    public priceCzk: number,
  ) {
  }
}

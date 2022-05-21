export class Dividend {
  constructor(
    public name: string,
    public date: Date,
    public amount: number,
    public tax: number,
    public taxCzk: number
  ) {
  }
}

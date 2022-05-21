export class Crypto {
  constructor(
    public name: string,
    public date: Date,
    public volume: number,
    public buyPrice: number,
    public czkPrice: number,
  ) {
  }
}

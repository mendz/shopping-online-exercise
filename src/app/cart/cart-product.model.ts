export class CartProduct {
  public id: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public amount: number;
  public costPrice: number;

  constructor(
    id: string,
    name: string,
    desc: string,
    imagePath: string,
    price: number,
    amount?: number
  ) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.amount = amount || 1; // set the initial amount
    this.costPrice = price;
  }
}

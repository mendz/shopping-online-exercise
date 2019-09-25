export class Product {
  public id: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public price: number;
  public dateAdded: Date;

  constructor(
    id: string,
    name: string,
    desc: string,
    imagePath: string,
    price: number,
    date?: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.price = price;
    this.dateAdded = date || new Date();
  }
}

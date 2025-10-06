import { ItemName } from '../value-objects/ItemName';

const QUALITY_LIMITS = {
  MIN: 0,
  MAX: 50,
  LEGENDARY: 80
} as const;

export class Item {  
  constructor(
    public readonly name: string,
    public sellIn: number,
    public quality: number
  ) {
    this.validateQuality(quality, name);
  }

  private validateQuality(quality: number, itemName: string): void {
    const itemNameObj = new ItemName(itemName);
    const isLegendary = itemNameObj.isLegendary();
    
    if (quality < 0) {
      throw new Error('Quality cannot be negative');
    }

    if (!isLegendary && quality > QUALITY_LIMITS.MAX) {
      throw new Error(`Quality must be between 0 and ${QUALITY_LIMITS.MAX} for non-legendary items`);
    }

    if (isLegendary && quality !== QUALITY_LIMITS.LEGENDARY) {
      throw new Error(`Legendary items must have quality ${QUALITY_LIMITS.LEGENDARY}, got ${quality}`);
    }
  }

  public updateSellIn(): void {
    const itemName = new ItemName(this.name);
    if (itemName.isLegendary()) {
      return;
    }
    this.sellIn -= 1;
  }
 
  public increaseQuality(amount: number = 1): void {
    const itemName = new ItemName(this.name);
    
    if (itemName.isLegendary()) {
      throw new Error('Cannot modify quality of legendary items');
    }
    
    if (this.quality + amount > QUALITY_LIMITS.MAX) {
      throw new Error(`Quality cannot exceed ${QUALITY_LIMITS.MAX}`);
    }

    this.quality += amount;
  }
 
  public decreaseQuality(amount: number = 1): void {
    const itemName = new ItemName(this.name);
     
    if (itemName.isLegendary()) {
      throw new Error('Cannot modify quality of legendary items');
    }
 
    if (this.quality - amount < 0) {
      throw new Error('Quality cannot be negative');
    }

    this.quality -= amount;
  }
 
  public setQualityToZero(): void {
    const itemName = new ItemName(this.name); 
    if (itemName.isLegendary()) {
      throw new Error('Cannot modify quality of legendary items');
    }

    this.quality = 0;
  }
 
  public isExpired(): boolean {
    return this.sellIn < 0;
  }
 
  public canIncreaseQuality(): boolean {
    const itemName = new ItemName(this.name);
    return !itemName.isLegendary() && this.quality < QUALITY_LIMITS.MAX;
  }
 
  public canDecreaseQuality(): boolean {
    const itemName = new ItemName(this.name);
    return !itemName.isLegendary() && this.quality > 0;
  }
}
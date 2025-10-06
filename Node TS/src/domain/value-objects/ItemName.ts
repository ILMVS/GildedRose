export enum ItemCategory {
  NORMAL = 'NORMAL',
  LEGENDARY = 'LEGENDARY',
  AGING = 'AGING',
  TIME_SENSITIVE = 'TIME_SENSITIVE',
  CONJURED = 'CONJURED'
}

export enum ItemType {
  NORMAL = 'Normal Item', 
  SULFURAS = 'Sulfuras, Hand of Ragnaros', 
  AGED_BRIE = 'Aged Brie', 
  BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert', 
  CONJURED = 'Conjured'
}
 
interface ItemConfig {
  category: ItemCategory;
  keywords: string[];
}

const ITEM_CONFIGURATIONS: Map<ItemType, ItemConfig> = new Map([ 
  [ItemType.SULFURAS, {
    category: ItemCategory.LEGENDARY,
    keywords: ['Sulfuras']
  }],
   
  [ItemType.AGED_BRIE, {
    category: ItemCategory.AGING,
    keywords: ['Aged Brie']
  }],
   
  [ItemType.BACKSTAGE_PASSES, {
    category: ItemCategory.TIME_SENSITIVE,
    keywords: ['Backstage passes']
  }],
   
  [ItemType.CONJURED, {
    category: ItemCategory.CONJURED,
    keywords: ['Conjured']
  }]
]);

export class ItemName {
  private readonly value: string;
  private readonly detectedType: ItemType;
  private readonly detectedCategory: ItemCategory;

  constructor(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Item name cannot be empty');
    }
    
    this.value = name.trim();
    this.detectedType = this.detectType();
    this.detectedCategory = this.detectCategory();
  }
 
  private detectType(): ItemType {
    for (const [itemType, config] of ITEM_CONFIGURATIONS) {
      if (config.keywords.some(keyword => this.value.includes(keyword))) {
        return itemType;
      }
    }
    return ItemType.NORMAL;
  }
 
  private detectCategory(): ItemCategory {
    const config = ITEM_CONFIGURATIONS.get(this.detectedType);
    return config?.category ?? ItemCategory.NORMAL;
  }
 
  public getValue(): string {
    return this.value;
  }

  public getType(): ItemType {
    return this.detectedType;
  }

  public getCategory(): ItemCategory {
    return this.detectedCategory;
  }
   
  public isLegendary(): boolean {
    return this.detectedCategory === ItemCategory.LEGENDARY;
  }

  public isAging(): boolean {
    return this.detectedCategory === ItemCategory.AGING;
  }
 
  public isTimeSensitive(): boolean {
    return this.detectedCategory === ItemCategory.TIME_SENSITIVE;
  }
 
  public isConjured(): boolean {
    return this.detectedCategory === ItemCategory.CONJURED;
  }
 
  public isNormal(): boolean {
    return this.detectedCategory === ItemCategory.NORMAL;
  }
 
  // Utility methods 
  public toString(): string {
    return this.value;
  }

  public equals(other: ItemName): boolean {
    return this.value === other.value;
  }
}
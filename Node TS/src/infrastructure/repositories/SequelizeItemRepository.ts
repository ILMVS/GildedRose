import { injectable } from 'inversify';
import { ItemRepository } from '../../domain/interfaces/repositories';
import { Item } from '../../domain/entities/Item';
import { ItemModel } from '../database/models/ItemModel';
import { ItemName } from '../../domain/value-objects/ItemName';

@injectable()
export class SequelizeItemRepository implements ItemRepository {
  private deriveItemType(itemName: string): string {
    const itemNameObj = new ItemName(itemName);
    const type = itemNameObj.getType();
    
    // Map domain types to file types
    const typeMapping: Record<string, string> = {
      'Sulfuras': 'Sulfuras',
      'Aged Brie': 'Food',
      'Backstage Pass': 'Backstage Passes',
      'Conjured': 'Conjured',
    };
 
    for (const [key, value] of Object.entries(typeMapping)) {
      if (type.includes(key)) {
        return value;
      }
    }
 
    if (itemName.toLowerCase().includes('potion') || itemName.toLowerCase().includes('elixir')) {
      return 'Potion';
    }
    if (itemName.toLowerCase().includes('sword') || itemName.toLowerCase().includes('axe') || 
        itemName.toLowerCase().includes('halberd') || itemName.toLowerCase().includes('hammer')) {
      return 'Weapon';
    }
    if (itemName.toLowerCase().includes('vest') || itemName.toLowerCase().includes('mail') || 
        itemName.toLowerCase().includes('shield') || itemName.toLowerCase().includes('armor')) {
      return 'Armor';
    }
    if (itemName.toLowerCase().includes('brie') || itemName.toLowerCase().includes('cheese') || 
        itemName.toLowerCase().includes('mutton') || itemName.toLowerCase().includes('milk')) {
      return 'Food';
    }

    return 'Misc';
  }

  async findAll(): Promise<Item[]> {
    const itemRecords = await ItemModel.findAll();
    return itemRecords.map(record => 
      new Item(
        record.name,
        record.sellIn,
        record.quality
      )
    );
  }

  async save(items: Item[]): Promise<void> {
    await ItemModel.destroy({ where: {} });
    
    const itemsData = items.map(item => ({
      name: item.name,
      itemType: this.deriveItemType(item.name),
      sellIn: item.sellIn,
      quality: item.quality,
    }));

    await ItemModel.bulkCreate(itemsData);
  }

  async addItem(item: Item): Promise<void> {
    await ItemModel.create({
      name: item.name,
      itemType: this.deriveItemType(item.name),
      sellIn: item.sellIn,
      quality: item.quality,
    });
  }

  async clear(): Promise<void> {
    await ItemModel.destroy({ where: {} });
  }
}

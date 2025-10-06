import { injectable } from 'inversify';
import 'reflect-metadata';
import { Item } from '../../domain/entities/Item';
import * as fs from 'fs';

/**
 * Simple parser for inventory files
 * Format: Name,ItemType,SellIn,Quality
 * No complex mapping needed - file has the correct item names
 */
@injectable()
export class InventoryFileParser {
  static parseInventoryFile(filePath: string): Item[] {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.trim().split('\n');
      
      return lines.map(line => this.parseInventoryLine(line));
    } catch (error) {
      console.error('Error reading inventory file:', error);
      return [];
    }
  }

  private static parseInventoryLine(line: string): Item {
    const parts = line.split(',');
    if (parts.length !== 4) {
      throw new Error(`Invalid inventory line format: ${line}. Expected: Name,ItemType,SellIn,Quality`);
    }

    const [name, _itemType, sellInStr, qualityStr] = parts;
    const sellIn = parseInt(sellInStr.trim(), 10);
    const quality = parseInt(qualityStr.trim(), 10);

    if (isNaN(sellIn) || isNaN(quality)) {
      throw new Error(`Invalid numbers in line: ${line}`);
    }

    return new Item(name.trim(), sellIn, quality);
  }

  static createSampleInventory(): Item[] {
    return [
      new Item('Sword', 30, 50),
      new Item('Axe', 40, 50),
      new Item('Halberd', 60, 40),
      new Item('Aged Brie', 50, 10),
      new Item('Aged Milk', 20, 20),
      new Item('Mutton', 10, 10),
      new Item('Sulfuras, Hand of Ragnaros', 80, 80),
      new Item('Backstage passes to a TAFKAL80ETC concert', 20, 10),
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 10),
      new Item('Conjured', 15, 50),
      new Item('Conjured', 20, 50),
      new Item('Conjured', 20, 40),
      new Item('Cheese', 5, 5),
      new Item('Potion of Healing', 10, 10),
      new Item('Bag of Holding', 10, 50),
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
      new Item('Elixir of the Mongoose', 5, 7),
      new Item('+5 Dexterity Vest', 10, 20),
      new Item('Full Plate Mail', 50, 50),
      new Item('Wooden Shield', 10, 30)
    ];
  }
}
import { describe, it, expect } from 'vitest';
import { ItemName, ItemType, ItemCategory } from '../../src/domain/value-objects/ItemName';

describe('ItemName Value Object', () => {
  describe('Item Type Detection', () => {
    it('should identify Aged Brie correctly', () => {
      const itemName = new ItemName('Aged Brie');
      
      expect(itemName.getType()).toBe(ItemType.AGED_BRIE);
      expect(itemName.getCategory()).toBe(ItemCategory.AGING);
      expect(itemName.isAging()).toBe(true);
      expect(itemName.isLegendary()).toBe(false);
    });

    it('should identify Sulfuras correctly', () => {
      const itemName = new ItemName('Sulfuras, Hand of Ragnaros');
      
      expect(itemName.getType()).toBe(ItemType.SULFURAS);
      expect(itemName.getCategory()).toBe(ItemCategory.LEGENDARY);
      expect(itemName.isLegendary()).toBe(true);
    });

    it('should identify Backstage Passes correctly', () => {
      const itemName = new ItemName('Backstage passes to a TAFKAL80ETC concert');
      
      expect(itemName.getType()).toBe(ItemType.BACKSTAGE_PASSES);
      expect(itemName.getCategory()).toBe(ItemCategory.TIME_SENSITIVE);
      expect(itemName.isTimeSensitive()).toBe(true);
      expect(itemName.isLegendary()).toBe(false);
    });

    it('should identify Conjured items correctly', () => {
      const itemName = new ItemName('Conjured');
      
      expect(itemName.getType()).toBe(ItemType.CONJURED);
      expect(itemName.getCategory()).toBe(ItemCategory.CONJURED);
      expect(itemName.isConjured()).toBe(true);
      expect(itemName.isLegendary()).toBe(false);
    });

    it('should identify Normal items correctly', () => {
      const itemName = new ItemName('Regular Sword');
      
      expect(itemName.getType()).toBe(ItemType.NORMAL);
      expect(itemName.getCategory()).toBe(ItemCategory.NORMAL);
      expect(itemName.isNormal()).toBe(true);
      expect(itemName.isLegendary()).toBe(false);
      expect(itemName.isConjured()).toBe(false);
    });
  });

  describe('Value Retrieval', () => {
    it('should return the original value', () => {
      const originalName = 'Test Item Name';
      const itemName = new ItemName(originalName);
      
      expect(itemName.getValue()).toBe(originalName);
    });
  });
});
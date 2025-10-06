import { describe, it, expect } from 'vitest';
import { ItemName, ItemCategory, ItemType } from '../../src/domain/value-objects/ItemName';

describe('ItemName - Category Detection (Escalabilidad)', () => {
  describe('Legendary Items (Categoría LEGENDARY)', () => {
    it('should detect Sulfuras as legendary', () => {
      const item = new ItemName('Sulfuras, Hand of Ragnaros');
      
      expect(item.getCategory()).toBe(ItemCategory.LEGENDARY);
      expect(item.getType()).toBe(ItemType.SULFURAS);
      expect(item.isLegendary()).toBe(true);
      expect(item.isNormal()).toBe(false);
    });

    it('should detect any item with "Sulfuras" keyword as legendary', () => {
      const item = new ItemName('Sulfuras');
      
      expect(item.isLegendary()).toBe(true);
      expect(item.getCategory()).toBe(ItemCategory.LEGENDARY);
    });
  });

  describe('Aging Items (Categoría AGING)', () => {
    it('should detect Aged Brie as aging', () => {
      const item = new ItemName('Aged Brie');
      
      expect(item.getCategory()).toBe(ItemCategory.AGING);
      expect(item.getType()).toBe(ItemType.AGED_BRIE);
      expect(item.isAging()).toBe(true);
      expect(item.isLegendary()).toBe(false);
    });
  });

  describe('Time-Sensitive Items (Categoría TIME_SENSITIVE)', () => {
    it('should detect Backstage passes as time-sensitive', () => {
      const item = new ItemName('Backstage passes to a TAFKAL80ETC concert');
      
      expect(item.getCategory()).toBe(ItemCategory.TIME_SENSITIVE);
      expect(item.getType()).toBe(ItemType.BACKSTAGE_PASSES);
      expect(item.isTimeSensitive()).toBe(true);
      expect(item.isLegendary()).toBe(false);
    });
  });

  describe('Conjured Items (Categoría CONJURED)', () => {
    it('should detect Conjured items', () => {
      const item = new ItemName('Conjured');
      
      expect(item.getCategory()).toBe(ItemCategory.CONJURED);
      expect(item.getType()).toBe(ItemType.CONJURED);
      expect(item.isConjured()).toBe(true);
    });

    it('should detect items with Conjured keyword', () => {
      const item = new ItemName('Conjured Mana Cake');
      
      expect(item.isConjured()).toBe(true);
      expect(item.getCategory()).toBe(ItemCategory.CONJURED);
    });
  });

  describe('Normal Items (Categoría NORMAL)', () => {
    it('should detect normal items', () => {
      const item = new ItemName('Normal Item');
      
      expect(item.getCategory()).toBe(ItemCategory.NORMAL);
      expect(item.getType()).toBe(ItemType.NORMAL);
      expect(item.isNormal()).toBe(true);
      expect(item.isLegendary()).toBe(false);
      expect(item.isAging()).toBe(false);
      expect(item.isTimeSensitive()).toBe(false);
      expect(item.isConjured()).toBe(false);
    });

    it('should default unknown items to normal', () => {
      const item = new ItemName('Random Item Name');
      
      expect(item.getCategory()).toBe(ItemCategory.NORMAL);
      expect(item.isNormal()).toBe(true);
    });
  });

  describe('Validaciones', () => {
    it('should throw error for empty name', () => {
      expect(() => new ItemName('')).toThrow('Item name cannot be empty');
    });

    it('should trim whitespace from name', () => {
      const item = new ItemName('  Aged Brie  ');
      
      expect(item.getValue()).toBe('Aged Brie');
      expect(item.isAging()).toBe(true);
    });
  });

  describe('Utilidades', () => {
    it('should compare ItemNames by value', () => {
      const item1 = new ItemName('Aged Brie');
      const item2 = new ItemName('Aged Brie');
      const item3 = new ItemName('Sulfuras, Hand of Ragnaros');
      
      expect(item1.equals(item2)).toBe(true);
      expect(item1.equals(item3)).toBe(false);
    });

    it('should convert to string', () => {
      const item = new ItemName('Aged Brie');
      
      expect(item.toString()).toBe('Aged Brie');
    });
  });
});

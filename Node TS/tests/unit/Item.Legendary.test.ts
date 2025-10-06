import { describe, it, expect } from 'vitest';
import { Item } from '../../src/domain/entities/Item';

describe('Item - Legendary Items Validation', () => {
  describe('Constructor Validation', () => {
    it('should create Sulfuras with quality 80', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      expect(sulfuras.name).toBe('Sulfuras, Hand of Ragnaros');
      expect(sulfuras.quality).toBe(80);
      expect(sulfuras.sellIn).toBe(0);
    });

    it('should throw error if Sulfuras created with quality other than 80', () => {
      expect(() => {
        new Item('Sulfuras, Hand of Ragnaros', 0, 50);
      }).toThrow('Legendary items must have quality 80, got 50');

      expect(() => {
        new Item('Sulfuras, Hand of Ragnaros', 5, 100);
      }).toThrow('Legendary items must have quality 80, got 100');

      expect(() => {
        new Item('Sulfuras, Hand of Ragnaros', 0, 0);
      }).toThrow('Legendary items must have quality 80, got 0');
    });

    it('should create normal items with quality between 0 and 50', () => {
      const item1 = new Item('Normal Item', 10, 0);
      const item2 = new Item('Aged Brie', 5, 25);
      const item3 = new Item('Backstage passes to a TAFKAL80ETC concert', 15, 50);
      
      expect(item1.quality).toBe(0);
      expect(item2.quality).toBe(25);
      expect(item3.quality).toBe(50);
    });

    it('should throw error for normal items with quality > 50', () => {
      expect(() => {
        new Item('Normal Item', 10, 51);
      }).toThrow('Quality must be between 0 and 50 for non-legendary items');
    });

    it('should throw error for negative quality', () => {
      expect(() => {
        new Item('Normal Item', 10, -1);
      }).toThrow('Quality cannot be negative');
    });
  });

  describe('updateSellIn() - Legendary Protection', () => {
    it('should NOT decrease sellIn for Sulfuras', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      sulfuras.updateSellIn();
      expect(sulfuras.sellIn).toBe(0);
      
      sulfuras.updateSellIn();
      expect(sulfuras.sellIn).toBe(0);
    });

    it('should decrease sellIn for normal items', () => {
      const item = new Item('Normal Item', 10, 20);
      
      item.updateSellIn();
      expect(item.sellIn).toBe(9);
      
      item.updateSellIn();
      expect(item.sellIn).toBe(8);
    });
  });

  describe('increaseQuality() - Legendary Protection', () => {
    it('should throw error when trying to increase quality of Sulfuras', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      expect(() => {
        sulfuras.increaseQuality(5);
      }).toThrow('Cannot modify quality of legendary items');

      expect(() => {
        sulfuras.increaseQuality(1);
      }).toThrow('Cannot modify quality of legendary items');
    });

    it('should increase quality for normal items', () => {
      const item = new Item('Aged Brie', 10, 20);
      
      item.increaseQuality(5);
      expect(item.quality).toBe(25);
    });

    it('should throw error when increasing quality above 50 for normal items', () => {
      const item = new Item('Normal Item', 10, 48);
      
      expect(() => {
        item.increaseQuality(5);
      }).toThrow('Quality cannot exceed 50');
    });
  });

  describe('decreaseQuality() - Legendary Protection', () => {
    it('should throw error when trying to decrease quality of Sulfuras', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      expect(() => {
        sulfuras.decreaseQuality(5);
      }).toThrow('Cannot modify quality of legendary items');

      expect(() => {
        sulfuras.decreaseQuality(1);
      }).toThrow('Cannot modify quality of legendary items');
    });

    it('should decrease quality for normal items', () => {
      const item = new Item('Normal Item', 10, 20);
      
      item.decreaseQuality(5);
      expect(item.quality).toBe(15);
    });

    it('should throw error when decreasing quality below 0', () => {
      const item = new Item('Normal Item', 10, 3);
      
      expect(() => {
        item.decreaseQuality(5);
      }).toThrow('Quality cannot be negative');
    });
  });

  describe('setQualityToZero() - Legendary Protection', () => {
    it('should throw error when trying to set Sulfuras quality to zero', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      expect(() => {
        sulfuras.setQualityToZero();
      }).toThrow('Cannot modify quality of legendary items');
    });

    it('should set quality to zero for normal items', () => {
      const item = new Item('Backstage passes to a TAFKAL80ETC concert', -1, 50);
      
      item.setQualityToZero();
      expect(item.quality).toBe(0);
    });
  });

  describe('canIncreaseQuality() - Legendary Protection', () => {
    it('should return false for Sulfuras', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      expect(sulfuras.canIncreaseQuality()).toBe(false);
    });

    it('should return true for normal items with quality < 50', () => {
      const item = new Item('Aged Brie', 10, 25);
      
      expect(item.canIncreaseQuality()).toBe(true);
    });

    it('should return false for normal items with quality = 50', () => {
      const item = new Item('Aged Brie', 10, 50);
      
      expect(item.canIncreaseQuality()).toBe(false);
    });
  });

  describe('canDecreaseQuality() - Legendary Protection', () => {
    it('should return false for Sulfuras', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      expect(sulfuras.canDecreaseQuality()).toBe(false);
    });

    it('should return true for normal items with quality > 0', () => {
      const item = new Item('Normal Item', 10, 20);
      
      expect(item.canDecreaseQuality()).toBe(true);
    });

    it('should return false for normal items with quality = 0', () => {
      const item = new Item('Normal Item', 10, 0);
      
      expect(item.canDecreaseQuality()).toBe(false);
    });
  });

  describe('isExpired()', () => {
    it('should return true when sellIn < 0', () => {
      const item = new Item('Normal Item', -1, 20);
      
      expect(item.isExpired()).toBe(true);
    });

    it('should return false when sellIn >= 0', () => {
      const item1 = new Item('Normal Item', 0, 20);
      const item2 = new Item('Normal Item', 10, 20);
      
      expect(item1.isExpired()).toBe(false);
      expect(item2.isExpired()).toBe(false);
    });

    it('should work for Sulfuras (always false since sellIn never changes)', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80);
      
      expect(sulfuras.isExpired()).toBe(false);
    });
  });
});

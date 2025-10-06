import { describe, it, expect } from 'vitest';
import { Item } from '../../src/domain/entities/Item';

describe('Item Entity', () => {
  describe('Constructor', () => {
    it('should create an item with valid properties', () => {
      const item = new Item('Test Item', 10, 20);
      
      expect(item.name).toBe('Test Item');
      expect(item.sellIn).toBe(10);
      expect(item.quality).toBe(20);
    });

    it('should throw error for invalid quality', () => {
      expect(() => new Item('Test', 10, -1)).toThrow('Quality cannot be negative');
      expect(() => new Item('Test', 10, 51)).toThrow('Quality must be between 0 and 50 for non-legendary items');
    });

    it('should allow Sulfuras to have quality > 50', () => {
      expect(() => new Item('Sulfuras, Hand of Ragnaros', 10, 80)).not.toThrow();
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 10, 80);
      expect(sulfuras.quality).toBe(80);
    });
  });

  describe('Quality Management', () => {
    it('should increase quality correctly', () => {
      const item = new Item('Test', 10, 20);
      item.increaseQuality(5);
      
      expect(item.quality).toBe(25);
    });

    it('should not increase quality above 50', () => {
      const item = new Item('Test', 10, 48);
      
      expect(() => {
        item.increaseQuality(5);
      }).toThrow('Quality cannot exceed 50');
      
      expect(item.quality).toBe(48);
    });

    it('should decrease quality correctly', () => {
      const item = new Item('Test', 10, 20);
      item.decreaseQuality(5);
      
      expect(item.quality).toBe(15);
    });

    it('should not decrease quality below 0', () => {
      const item = new Item('Test', 10, 3);
      
      expect(() => {
        item.decreaseQuality(5);
      }).toThrow('Quality cannot be negative');
      
      expect(item.quality).toBe(3);
    });

    it('should set quality to zero', () => {
      const item = new Item('Test', 10, 30);
      item.setQualityToZero();
      
      expect(item.quality).toBe(0);
    });
  });

  describe('SellIn Management', () => {
    it('should update sellIn correctly', () => {
      const item = new Item('Test', 10, 20);
      item.updateSellIn();
      
      expect(item.sellIn).toBe(9);
    });

    it('should identify expired items', () => {
      const item = new Item('Test', -1, 20);
      
      expect(item.isExpired()).toBe(true);
    });

    it('should identify non-expired items', () => {
      const item = new Item('Test', 1, 20);
      
      expect(item.isExpired()).toBe(false);
    });
  });

  describe('Quality Bounds Checking', () => {
    it('should check if quality can be increased', () => {
      const item1 = new Item('Test', 10, 49);
      const item2 = new Item('Test', 10, 50);
      
      expect(item1.canIncreaseQuality()).toBe(true);
      expect(item2.canIncreaseQuality()).toBe(false);
    });

    it('should check if quality can be decreased', () => {
      const item1 = new Item('Test', 10, 1);
      const item2 = new Item('Test', 10, 0);
      
      expect(item1.canDecreaseQuality()).toBe(true);
      expect(item2.canDecreaseQuality()).toBe(false);
    });
  });
});
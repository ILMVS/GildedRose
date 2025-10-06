import { describe, it, expect, beforeEach } from 'vitest';
import 'reflect-metadata'; 
import { TYPES } from '../../src/shared/types/inversify.types';
import { Item } from '../../src/domain/entities/Item';
import type { QualityUpdateService } from '../../src/application/services/QualityUpdateService';
import container from '@/ioc/container';

describe('QualityUpdateService', () => {
  let qualityUpdateService: QualityUpdateService;

  beforeEach(() => {
    qualityUpdateService = container.get<QualityUpdateService>(TYPES.QualityUpdateService);
  });

  describe('Normal Items', () => {
    it('should decrease quality and sellIn for normal items', () => {
      const item = new Item('Normal Item', 10, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(9);
      expect(item.sellIn).toBe(9);
    });

    it('should decrease quality twice as fast after sell date', () => {
      const item = new Item('Normal Item', 0, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(8);
      expect(item.sellIn).toBe(-1);
    });

    it('should not decrease quality below 0', () => {
      const item = new Item('Normal Item', 10, 0);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(0);
    });
  });

  describe('Aged Brie', () => {
    it('should increase quality for Aged Brie', () => {
      const item = new Item('Aged Brie', 10, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(11);
      expect(item.sellIn).toBe(9);
    });

    it('should increase quality twice as fast after sell date', () => {
      const item = new Item('Aged Brie', 0, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(12);
      expect(item.sellIn).toBe(-1);
    });

    it('should not increase quality above 50', () => {
      const item = new Item('Aged Brie', 10, 50);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(50);
    });
  });

  describe('Sulfuras', () => {
    it('should not change Sulfuras quality or sellIn', () => {
      const item = new Item('Sulfuras, Hand of Ragnaros', 10, 80);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(80);
      expect(item.sellIn).toBe(10);
    });
  });

  describe('Backstage Passes', () => {
    it('should increase quality by 1 when more than 10 days', () => {
      const item = new Item('Backstage passes to a TAFKAL80ETC concert', 15, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(11);
    });

    it('should increase quality by 2 when 6-10 days', () => {
      const item = new Item('Backstage passes to a TAFKAL80ETC concert', 10, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(12);
    });

    it('should increase quality by 3 when 1-5 days', () => {
      const item = new Item('Backstage passes to a TAFKAL80ETC concert', 5, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(13);
    });

    it('should drop quality to 0 after concert', () => {
      const item = new Item('Backstage passes to a TAFKAL80ETC concert', 0, 10);
      qualityUpdateService.updateItemQuality(item);
      
      expect(item.quality).toBe(0);
    });
  });
});
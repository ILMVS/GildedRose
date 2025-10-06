import { injectable } from 'inversify';
import 'reflect-metadata';
import { Item } from '../../domain/entities/Item';
import { QualityUpdateStrategy } from '../../domain/interfaces/repositories';
 
@injectable()
export class NormalItemStrategy implements QualityUpdateStrategy {
  update(item: Item): void {
    if (item.canDecreaseQuality()) {
      item.decreaseQuality();
    }

    item.updateSellIn();

    if (item.isExpired() && item.canDecreaseQuality()) {
      item.decreaseQuality();
    }
  }
}
 
@injectable()
export class AgingItemStrategy implements QualityUpdateStrategy {
  update(item: Item): void {
    if (item.canIncreaseQuality()) {
      item.increaseQuality();
    }

    item.updateSellIn();

    if (item.isExpired() && item.canIncreaseQuality()) {
      item.increaseQuality();
    }
  }
}
 
@injectable()
export class TimeSensitiveItemStrategy implements QualityUpdateStrategy {
  update(item: Item): void {
    if (item.canIncreaseQuality()) {
      item.increaseQuality();

      if (item.sellIn < 11 && item.canIncreaseQuality()) {
        item.increaseQuality();
      }

      if (item.sellIn < 6 && item.canIncreaseQuality()) {
        item.increaseQuality();
      }
    }

    item.updateSellIn();

    if (item.isExpired()) {
      item.setQualityToZero();
    }
  }
}
 
@injectable()
export class LegendaryItemStrategy implements QualityUpdateStrategy {
  update(_item: Item): void {
    return;
  }
}
 
@injectable()
export class ConjuredItemStrategy implements QualityUpdateStrategy {
  update(item: Item): void {
    if (item.canDecreaseQuality()) {
      item.decreaseQuality(2);
    }

    item.updateSellIn();

    if (item.isExpired() && item.canDecreaseQuality()) {
      item.decreaseQuality(2);
    }
  }
}
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Item } from '../../domain/entities/Item';
import { ItemName, ItemCategory } from '../../domain/value-objects/ItemName';
import type { QualityUpdateStrategy } from '../../domain/interfaces/repositories';
import type { IQualityUpdateService } from '../interfaces/IQualityUpdateService';
import { TYPES } from '../../shared/types/inversify.types';

/**
 * Servicio que gestiona la actualización de calidad usando el patrón Strategy
 * Ahora usa CATEGORÍAS genéricas en lugar de tipos específicos
 * Esto permite escalar sin modificar este código
 * 
 * ✅ Inyección de dependencias con Inversify
 */
@injectable()
export class QualityUpdateService implements IQualityUpdateService {
  private strategies: Map<ItemCategory, QualityUpdateStrategy>;

  constructor(
    @inject(TYPES.NormalItemStrategy) normalStrategy: QualityUpdateStrategy,
    @inject(TYPES.LegendaryItemStrategy) legendaryStrategy: QualityUpdateStrategy,
    @inject(TYPES.AgingItemStrategy) agingStrategy: QualityUpdateStrategy,
    @inject(TYPES.TimeSensitiveItemStrategy) timeSensitiveStrategy: QualityUpdateStrategy,
    @inject(TYPES.ConjuredItemStrategy) conjuredStrategy: QualityUpdateStrategy
  ) {
    this.strategies = new Map([
      [ItemCategory.NORMAL, normalStrategy],
      [ItemCategory.LEGENDARY, legendaryStrategy],
      [ItemCategory.AGING, agingStrategy],
      [ItemCategory.TIME_SENSITIVE, timeSensitiveStrategy],
      [ItemCategory.CONJURED, conjuredStrategy]
    ]);
  }

  updateItemQuality(item: Item): void {
    const itemName = new ItemName(item.name);
    const category = itemName.getCategory();
    const strategy = this.strategies.get(category);
    
    if (!strategy) {
      throw new Error(`No strategy found for category: ${category}`);
    }
    
    strategy.update(item);
  }

  updateAllItems(items: Item[]): Item[] {
    items.forEach(item => this.updateItemQuality(item));
    return items;
  }
}
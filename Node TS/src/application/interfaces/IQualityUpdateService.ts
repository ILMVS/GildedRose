import { Item } from '../../domain/entities/Item';

export interface IQualityUpdateService {
 
  updateItemQuality(item: Item): void;
 
  updateAllItems(items: Item[]): Item[];
}

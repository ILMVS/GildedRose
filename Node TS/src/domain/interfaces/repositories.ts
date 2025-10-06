import { Item } from '../entities/Item';

export interface ItemRepository {
  findAll(): Promise<Item[]>;
  save(items: Item[]): Promise<void>;
  addItem(item: Item): Promise<void>;
  clear(): Promise<void>;
}

export interface QualityUpdateStrategy {
  update(item: Item): void;
}
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Item } from '../../domain/entities/Item';
import { ItemRepository } from '../../domain/interfaces/repositories';

@injectable()
export class InMemoryItemRepository implements ItemRepository {
  private items: Item[] = [];

  constructor(initialItems: Item[] = []) {
    this.items = initialItems;
  }

  async findAll(): Promise<Item[]> {
    return [...this.items];
  }

  async save(items: Item[]): Promise<void> {
    this.items = [...items];
  }

  async addItem(item: Item): Promise<void> {
    this.items.push(item);
  }

  async clear(): Promise<void> {
    this.items = [];
  }
}
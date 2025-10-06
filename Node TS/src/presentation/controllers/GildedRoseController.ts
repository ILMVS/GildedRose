import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Item } from '../../domain/entities/Item';
import type { IUseCase } from '../../application/interfaces/IUseCase';
import { TYPES } from '../../shared/types/inversify.types';

@injectable()
export class GildedRoseController {
  constructor(
    @inject(TYPES.UpdateInventoryUseCase) private updateInventoryUseCase: IUseCase<Item[]>
  ) {}

  async updateInventory(): Promise<Item[]> {
    try {
      return await this.updateInventoryUseCase.execute();
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  }

  displayInventory(items: Item[]): void {
    console.log('Current Inventory:');
    console.log('Name, SellIn, Quality');
    items.forEach(item => {
      console.log(`${item.name}, ${item.sellIn}, ${item.quality}`);
    });
  }
}
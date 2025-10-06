import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Item } from '../../domain/entities/Item';
import type { ItemRepository } from '../../domain/interfaces/repositories';
import type { IQualityUpdateService } from '../interfaces/IQualityUpdateService';
import type { IUseCase } from '../interfaces/IUseCase';
import { TYPES } from '../../shared/types/inversify.types';

@injectable()
export class UpdateInventoryUseCase implements IUseCase<Item[]> {
  constructor(
    @inject(TYPES.ItemRepository) private itemRepository: ItemRepository,
    @inject(TYPES.QualityUpdateService) private qualityUpdateService: IQualityUpdateService
  ) {}

  async execute(): Promise<Item[]> {
    const items = await this.itemRepository.findAll();
    const updatedItems = this.qualityUpdateService.updateAllItems(items);
    await this.itemRepository.save(updatedItems);
    return updatedItems;
  }
}
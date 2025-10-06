import { Container } from 'inversify';
import { TYPES } from '../shared/types/inversify.types';
import type { ItemRepository } from '../domain/interfaces/repositories';
import { InMemoryItemRepository } from '../infrastructure/repositories/InMemoryItemRepository';
import { SequelizeItemRepository } from '../infrastructure/repositories/SequelizeItemRepository';

const USE_DATABASE = process.env.USE_MYSQL === 'true';

export function loadRepositories(container: Container): void {
  if (USE_DATABASE) {
    container.bind<ItemRepository>(TYPES.ItemRepository)
      .to(SequelizeItemRepository)
      .inSingletonScope();
  } else {
    container.bind<ItemRepository>(TYPES.ItemRepository)
      .to(InMemoryItemRepository)
      .inSingletonScope();
  }
}

import { Container } from 'inversify';
import 'reflect-metadata';
import { Item } from '../domain/entities/Item';
import type { ItemRepository } from '../domain/interfaces/repositories';
import type { QualityUpdateStrategy } from '../domain/interfaces/repositories';
import type { IQualityUpdateService } from '../application/interfaces/IQualityUpdateService';
import type { IUseCase } from '../application/interfaces/IUseCase';
import { InMemoryItemRepository } from '../infrastructure/repositories/InMemoryItemRepository';
import { SequelizeItemRepository } from '../infrastructure/repositories/SequelizeItemRepository';
import {
  NormalItemStrategy,
  LegendaryItemStrategy,
  AgingItemStrategy,
  TimeSensitiveItemStrategy,
  ConjuredItemStrategy
} from '../application/services/QualityUpdateStrategies';
import { QualityUpdateService } from '../application/services/QualityUpdateService';
import { UpdateInventoryUseCase } from '../application/use-cases/UpdateInventoryUseCase';
import { GildedRoseController } from '../presentation/controllers/GildedRoseController';
import { InventoryFileParser } from '../infrastructure/persistence/InventoryFileParser';
import { TYPES } from '../shared/types/inversify.types';
 
const container = new Container();
 
// Repositories (Environment-based selection) 
const USE_DATABASE = process.env.USE_MYSQL === 'true';

if (USE_DATABASE) {
  container.bind<ItemRepository>(TYPES.ItemRepository)
    .to(SequelizeItemRepository)
    .inSingletonScope();
} else {
  container.bind<ItemRepository>(TYPES.ItemRepository)
    .to(InMemoryItemRepository)
    .inSingletonScope();
}
 
// Strategies (Pattern: Strategy) 
container.bind<QualityUpdateStrategy>(TYPES.NormalItemStrategy)
  .to(NormalItemStrategy)
  .inSingletonScope();

container.bind<QualityUpdateStrategy>(TYPES.LegendaryItemStrategy)
  .to(LegendaryItemStrategy)
  .inSingletonScope();

container.bind<QualityUpdateStrategy>(TYPES.AgingItemStrategy)
  .to(AgingItemStrategy)
  .inSingletonScope();

container.bind<QualityUpdateStrategy>(TYPES.TimeSensitiveItemStrategy)
  .to(TimeSensitiveItemStrategy)
  .inSingletonScope();

container.bind<QualityUpdateStrategy>(TYPES.ConjuredItemStrategy)
  .to(ConjuredItemStrategy)
  .inSingletonScope();
 
// Services 
container.bind<IQualityUpdateService>(TYPES.QualityUpdateService)
  .to(QualityUpdateService)
  .inSingletonScope();
 
// Use Cases 
container.bind<IUseCase<Item[]>>(TYPES.UpdateInventoryUseCase)
  .to(UpdateInventoryUseCase)
  .inTransientScope();
 
// Controllers 
container.bind<GildedRoseController>(TYPES.GildedRoseController)
  .to(GildedRoseController)
  .inTransientScope();
 
// Infrastructure 
container.bind<InventoryFileParser>(TYPES.InventoryFileParser)
  .to(InventoryFileParser)
  .inSingletonScope();

export { container };
export default container;

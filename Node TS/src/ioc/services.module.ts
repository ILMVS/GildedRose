import { Container } from 'inversify';
import { TYPES } from '../shared/types/inversify.types';
import type { QualityUpdateStrategy } from '../domain/interfaces/repositories';
import type { IQualityUpdateService } from '../application/interfaces/IQualityUpdateService';
import {
  NormalItemStrategy,
  LegendaryItemStrategy,
  AgingItemStrategy,
  TimeSensitiveItemStrategy,
  ConjuredItemStrategy
} from '../application/services/QualityUpdateStrategies';
import { QualityUpdateService } from '../application/services/QualityUpdateService';

export function loadServices(container: Container): void {
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

  container.bind<IQualityUpdateService>(TYPES.QualityUpdateService)
    .to(QualityUpdateService)
    .inSingletonScope();
}

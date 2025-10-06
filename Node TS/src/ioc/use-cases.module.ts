import { Container } from 'inversify';
import { TYPES } from '../shared/types/inversify.types';
import { Item } from '../domain/entities/Item';
import type { IUseCase } from '../application/interfaces/IUseCase';
import { UpdateInventoryUseCase } from '../application/use-cases/UpdateInventoryUseCase';

export function loadUseCases(container: Container): void {
  container.bind<IUseCase<Item[]>>(TYPES.UpdateInventoryUseCase)
    .to(UpdateInventoryUseCase)
    .inTransientScope();
}

import { Container } from 'inversify';
import { TYPES } from '../shared/types/inversify.types';
import { InventoryFileParser } from '../infrastructure/persistence/InventoryFileParser';

export function loadInfrastructure(container: Container): void {
  container.bind<InventoryFileParser>(TYPES.InventoryFileParser)
    .to(InventoryFileParser)
    .inSingletonScope();
}

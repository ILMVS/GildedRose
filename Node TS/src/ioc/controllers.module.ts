import { Container } from 'inversify';
import { TYPES } from '../shared/types/inversify.types';
import { GildedRoseController } from '../presentation/controllers/GildedRoseController';

export function loadControllers(container: Container): void {
  container.bind<GildedRoseController>(TYPES.GildedRoseController)
    .to(GildedRoseController)
    .inTransientScope();
}

import { Container } from 'inversify';
import 'reflect-metadata';
import { loadRepositories } from './repositories.module';
import { loadServices } from './services.module';
import { loadUseCases } from './use-cases.module';
import { loadControllers } from './controllers.module';
import { loadInfrastructure } from './infrastructure.module';

const container = new Container();

loadRepositories(container);
loadServices(container);
loadUseCases(container);
loadControllers(container);
loadInfrastructure(container);

export { container };
export default container;

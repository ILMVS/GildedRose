import 'reflect-metadata';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { container } from './ioc/container';
import { TYPES } from './shared/types/inversify.types';
import { Item } from './domain/entities/Item';
import type { ItemRepository } from './domain/interfaces/repositories';
import type { GildedRoseController } from './presentation/controllers/GildedRoseController';
import { InventoryFileParser } from './infrastructure/persistence/InventoryFileParser';
import { typeDefs } from './presentation/graphql/schema';
import { resolvers } from './presentation/graphql/resolvers';
import { initDatabase } from './infrastructure/database/sequelize.config';
import { seedInitialInventory } from './infrastructure/database/seeders/inventory.seeder';
import * as path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

async function initializeInventory() {
  const repository = container.get<ItemRepository>(TYPES.ItemRepository);
  const useDatabase = process.env.USE_MYSQL === 'true';
  
  if (useDatabase) {
    await seedInitialInventory();
  } else {
    try {
      const inventoryPath = path.join(__dirname, '../inventory.txt');
      const items = InventoryFileParser.parseInventoryFile(inventoryPath);
      await repository.save(items);
      console.log(`Loaded ${items.length} items from inventory.txt`);
    } catch (error) {
      console.log('No inventory file found, using sample inventory');
      const sampleItems = InventoryFileParser.createSampleInventory();
      await repository.save(sampleItems);
      console.log(`Loaded ${sampleItems.length} sample items`);
    }
  }
}

async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized');
    
    await initializeInventory();
    
    const repository = container.get<ItemRepository>(TYPES.ItemRepository);
    const controller = container.get<GildedRoseController>(TYPES.GildedRoseController);
    
    app.get('/api/health', (_req: Request, res: Response) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Gilded Rose Inventory API',
        version: '2.0.0'
      });
    });
      
    app.get('/api/items', async (_req: Request, res: Response) => {
      try {
        const items = await repository.findAll();
        res.json({
          success: true,
          count: items.length,
          data: items
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
      
    app.post('/api/items', async (req: Request, res: Response): Promise<void> => {
      try {
        const { name, sellIn, quality } = req.body;

        if (!name || sellIn === undefined || quality === undefined) {
          res.status(400).json({
            success: false,
            error: 'Missing required fields: name, sellIn, quality'
          });
          return;
        }

        const newItem = new Item(name, sellIn, quality);
        await repository.addItem(newItem);

        res.status(201).json({
          success: true,
          message: 'Item added successfully',
          data: { name: newItem.name, sellIn: newItem.sellIn, quality: newItem.quality }
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Invalid item data'
        });
      }
    });
      
    app.post('/api/items/update', async (_req: Request, res: Response) => {
      try {
        const updatedItems = await controller.updateInventory();
        
        res.json({
          success: true,
          message: 'Inventory updated successfully',
          count: updatedItems.length,
          data: updatedItems
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Update failed'
        });
      }
    });
     
    app.post('/api/items/load-file', async (req: Request, res: Response): Promise<void> => {
      try {
        const { filePath } = req.body;

        if (!filePath) {
          res.status(400).json({
            success: false,
            error: 'Missing filePath in request body'
          });
          return;
        }

        const items = InventoryFileParser.parseInventoryFile(filePath);
        await repository.save(items);

        res.json({
          success: true,
          message: `Loaded ${items.length} items from file`,
          count: items.length,
          data: items
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to load file'
        });
      }
    });
     
    app.delete('/api/items', async (_req: Request, res: Response) => {
      try {
        await repository.clear();
        res.json({
          success: true,
          message: 'Inventory cleared'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Clear failed'
        });
      }
    });
     
    app.get('/', (_req: Request, res: Response) => {
      res.json({
        name: 'Gilded Rose Inventory API',
        version: '2.0.0',
        architecture: 'Clean Architecture + Inversify DI + Express + GraphQL',
        description: 'Use GraphQL for complex queries, REST for simple operations',
        restEndpoints: {
          health: 'GET /api/health',
          getItems: 'GET /api/items (basic list)',
          addItem: 'POST /api/items',
          updateInventory: 'POST /api/items/update (progress to next day)',
          loadFromFile: 'POST /api/items/load-file',
          clearInventory: 'DELETE /api/items'
        },
        graphql: {
          endpoint: 'POST /graphql',
          playground: 'GET /graphql (GraphQL Playground)',
          documentation: 'Introspection enabled'
        },
        documentation: 'https://github.com/ILMVS/GildedRose'
      });
    });

    app.all('/graphql', createHandler({ schema }));

    app.listen(PORT, () => { 
      console.log(`REST API: http://localhost:${PORT}/api`);
      console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
import { container } from '../../ioc/container';
import { TYPES } from '../../shared/types/inversify.types';
import { Item } from '../../domain/entities/Item';
import { ItemName } from '../../domain/value-objects/ItemName';
import type { ItemRepository } from '../../domain/interfaces/repositories';
import type { GildedRoseController } from '../controllers/GildedRoseController';
import { InventoryFileParser } from '../../infrastructure/persistence/InventoryFileParser';

function itemToGraphQL(item: Item) {
  const itemName = new ItemName(item.name);
  
  return {
    name: item.name,
    sellIn: item.sellIn,
    quality: item.quality,
    category: itemName.getCategory(),
    type: itemName.getType(),
    isExpired: item.isExpired(),
    isLegendary: itemName.isLegendary()
  };
}

export const resolvers = {
  Query: {
    items: async () => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      const items = await repository.findAll();
      return items.map(itemToGraphQL);
    },

    item: async (_parent: unknown, args: { name: string }) => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      const items = await repository.findAll();
      const item = items.find(i => i.name === args.name);
      return item ? itemToGraphQL(item) : null;
    },

    itemsByCategory: async (_parent: unknown, args: { category: string }) => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      const items = await repository.findAll();
      
      return items
        .filter(item => {
          const itemName = new ItemName(item.name);
          return itemName.getCategory() === args.category;
        })
        .map(itemToGraphQL);
    },

    expiredItems: async () => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      const items = await repository.findAll();
      
      return items
        .filter(item => item.isExpired())
        .map(itemToGraphQL);
    },

    inventoryStats: async () => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      const items = await repository.findAll();
      
      if (items.length === 0) {
        return {
          totalItems: 0,
          averageQuality: 0,
          averageSellIn: 0,
          itemsByCategory: [],
          legendaryCount: 0,
          expiredCount: 0
        };
      }
 
      const totalQuality = items.reduce((sum, item) => sum + item.quality, 0);
      const totalSellIn = items.reduce((sum, item) => sum + item.sellIn, 0);
       
      const categoryCounts = new Map<string, number>();
      let legendaryCount = 0;
      let expiredCount = 0;

      items.forEach(item => {
        const itemName = new ItemName(item.name);
        const category = itemName.getCategory();
        
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
        
        if (itemName.isLegendary()) legendaryCount++;
        if (item.isExpired()) expiredCount++;
      });

      const itemsByCategory = Array.from(categoryCounts.entries()).map(
        ([category, count]) => ({ category, count })
      );

      return {
        totalItems: items.length,
        averageQuality: totalQuality / items.length,
        averageSellIn: totalSellIn / items.length,
        itemsByCategory,
        legendaryCount,
        expiredCount
      };
    }
  },

  Mutation: {
    addItem: async (_parent: unknown, args: { input: { name: string; sellIn: number; quality: number } }) => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      const { name, sellIn, quality } = args.input;
      
      const newItem = new Item(name, sellIn, quality);
      await repository.addItem(newItem);
      
      return itemToGraphQL(newItem);
    },

    updateInventory: async () => {
      const controller = container.get<GildedRoseController>(TYPES.GildedRoseController);
      const updatedItems = await controller.updateInventory();
      
      return {
        success: true,
        message: 'Inventory updated successfully (1 day passed)',
        count: updatedItems.length
      };
    },

    loadFromFile: async (_parent: unknown, args: { input: { filePath: string } }) => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      
      try {
        const items = InventoryFileParser.parseInventoryFile(args.input.filePath);
        await repository.save(items);
        
        return {
          success: true,
          message: `Loaded ${items.length} items from file`,
          count: items.length
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to load file',
          count: 0
        };
      }
    },

    clearInventory: async () => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      await repository.clear();
      
      return {
        success: true,
        message: 'Inventory cleared',
        count: 0
      };
    },

    removeItem: async (_parent: unknown, args: { name: string }) => {
      const repository = container.get<ItemRepository>(TYPES.ItemRepository);
      const items = await repository.findAll();
      
      const initialCount = items.length;
      const filteredItems = items.filter(item => item.name !== args.name);
      
      if (filteredItems.length === initialCount) {
        return {
          success: false,
          message: `Item "${args.name}" not found`,
          count: initialCount
        };
      }
      
      await repository.save(filteredItems);
      
      return {
        success: true,
        message: `Item "${args.name}" removed`,
        count: filteredItems.length
      };
    }
  }
};

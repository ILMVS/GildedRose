import { ItemModel } from '../models/ItemModel';
import * as path from 'path';
import * as fs from 'fs';

export async function seedInitialInventory(): Promise<void> {
  try {
    const count = await ItemModel.count();
    if (count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    const inventoryPath = path.join(__dirname, '../../../../inventory.txt');
    const fileContent = fs.readFileSync(inventoryPath, 'utf-8');
    const lines = fileContent.trim().split('\n');

    const itemsData = lines.map(line => {
      const parts = line.split(',');
      if (parts.length !== 4) {
        throw new Error(`Invalid inventory line format: ${line}`);
      }

      const [name, itemType, sellInStr, qualityStr] = parts;
      return {
        name,
        itemType,
        sellIn: parseInt(sellInStr, 10),
        quality: parseInt(qualityStr, 10),
      };
    });

    await ItemModel.bulkCreate(itemsData);
    console.log(`✓ Seeded ${itemsData.length} items from inventory.txt`);
  } catch (error) {
    console.error('Error seeding inventory:', error);
    throw error;
  }
}

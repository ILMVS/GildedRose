 export const TYPES = { 
  ItemRepository: Symbol.for('ItemRepository'), 

  QualityUpdateService: Symbol.for('QualityUpdateService'),
  
  NormalItemStrategy: Symbol.for('NormalItemStrategy'),
  LegendaryItemStrategy: Symbol.for('LegendaryItemStrategy'),
  AgingItemStrategy: Symbol.for('AgingItemStrategy'),
  TimeSensitiveItemStrategy: Symbol.for('TimeSensitiveItemStrategy'),
  ConjuredItemStrategy: Symbol.for('ConjuredItemStrategy'),
  
  UpdateInventoryUseCase: Symbol.for('UpdateInventoryUseCase'),
  
  GildedRoseController: Symbol.for('GildedRoseController'),
  
  InventoryFileParser: Symbol.for('InventoryFileParser'),
};

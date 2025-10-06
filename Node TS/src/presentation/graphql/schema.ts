export const typeDefs = `#graphql
  """Gilded Rose item"""
  type Item {
    name: String!
    sellIn: Int!
    quality: Int!
    category: String!
    type: String!
    isExpired: Boolean!
    isLegendary: Boolean!
  }

  """Item input"""
  input CreateItemInput {
    name: String!
    sellIn: Int!
    quality: Int!
  }

  """Load items from file"""
  input LoadFromFileInput {
    filePath: String!
  }

  """Operation response"""
  type OperationResponse {
    success: Boolean!
    message: String!
    count: Int
  }

  """Queries"""
  type Query {
    items: [Item!]!
    item(name: String!): Item
    itemsByCategory(category: String!): [Item!]!
    expiredItems: [Item!]!
    inventoryStats: InventoryStats!
  }

  """Inventory stats"""
  type InventoryStats {
    totalItems: Int!
    averageQuality: Float!
    averageSellIn: Float!
    itemsByCategory: [CategoryCount!]!
    legendaryCount: Int!
    expiredCount: Int!
  }

  """Count by category"""
  type CategoryCount {
    category: String!
    count: Int!
  }

  """Mutations"""
  type Mutation {
    addItem(input: CreateItemInput!): Item!
    updateInventory: OperationResponse!
    loadFromFile(input: LoadFromFileInput!): OperationResponse!
    clearInventory: OperationResponse!
    removeItem(name: String!): OperationResponse!
  }
`;

    ;

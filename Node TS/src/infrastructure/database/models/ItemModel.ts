import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../sequelize.config';

interface ItemAttributes {
  id: number;
  name: string;
  itemType: string;
  sellIn: number;
  quality: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ItemModel extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  declare id: number;
  declare name: string;
  declare itemType: string;
  declare sellIn: number;
  declare quality: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ItemModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemType: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    sellIn: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 80,
      },
    },
  },
  {
    sequelize,
    tableName: 'items',
    modelName: 'Item',
  }
);

export default ItemModel;

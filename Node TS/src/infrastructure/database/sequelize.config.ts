import { Sequelize } from 'sequelize';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';
const useMySQL = process.env.USE_MYSQL === 'true';

export const sequelize = useMySQL
  ? new Sequelize({
      dialect: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'gilded_rose',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      logging: isDevelopment ? console.log : false,
      define: {
        timestamps: true,
        underscored: true,
      },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../../database.sqlite'),
      logging: isDevelopment ? console.log : false,
      define: {
        timestamps: true,
        underscored: true,
      },
    });

export async function initDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    await sequelize.sync({ alter: isDevelopment });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export default sequelize;

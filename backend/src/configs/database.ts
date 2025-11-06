import { Sequelize } from 'sequelize';
import { config } from './environment';

const customLogger = (msg: string) => {
  if (config.app.env === 'development') {
    if (msg.includes('SELECT 1+1') || msg.includes('ERROR')) {
      console.log(`🗄️  ${msg}`);
    } else if (msg.includes('CREATE TABLE') || msg.includes('CREATE INDEX')) {
      console.log(`🗃️  ${msg}`);
    }
  }
};

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  logging: customLogger,
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl:
      config.app.env === 'production'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
});

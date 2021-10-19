/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const config = require('./src/config');

export = {
  type: 'postgres',
  host: config.default.PGHOST,
  port: config.default.PGPORT,
  username: config.default.PGUSER,
  password: config.default.PGPASSWORD,
  database: config.default.PGDATABASE,
  synchronize: false,
  migrations: ['src/database/migrations/*.ts'],
  entities: [path.join(__dirname, '**', 'models', '*.model.ts')],
  logging: config.default.DATABASE_LOGGING,
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  ssl: config.default.NODE_ENV === 'production'
};
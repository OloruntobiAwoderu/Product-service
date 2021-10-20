import config from '../config';
import { Environ } from '../types';
import { Product, ProductBatch } from '../models'; 


const databaseProvider = async<U>(createConnection: <T>(options: T)=> Promise<U>): Promise<U> => createConnection({
    type: 'postgres',
    host: config.PGHOST,
    port: config.PGPORT,
    username: config.PGUSER,
    password: config.PGPASSWORD,
    database: config.PGDATABASE,
    entities: [
        Product,
        ProductBatch
        ],
    synchronize: false,
    ssl: config.NODE_ENV === Environ.production ? { rejectUnauthorized: false }
	: false,
    logging: config.DATABASE_LOGGING as boolean
}); 


export default databaseProvider;
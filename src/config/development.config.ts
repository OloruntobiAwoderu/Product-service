import 'dotenv/config';

export default {
    PGDATABASE: process.env.DEV_PGDATABASE as string,
    PGHOST: process.env.DEV_PGHOST as string,
    PGPORT: process.env.DEV_PGPORT as string,
    PGUSER: process.env.DEV_PGUSER as string,
    PGPASSWORD: process.env.DEV_PGPASSWORD as string,
    DATABASE_LOGGING: process.env.DEV_DATABASE_LOGGING,
    LOG_LEVEL: process.env.DEV_LOG_LEVEL
}
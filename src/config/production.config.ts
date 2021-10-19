import 'dotenv/config';

export default {
	DATABASE_URL: process.env.DATABASE_URL,
    PGDATABASE: process.env.PGDATABASE as string,
    PGHOST: process.env.PGHOST as string,
    PGPORT: process.env.PGPORT as string,
    PGUSER: process.env.PGUSER as string,
    PGPASSWORD: process.env.PGPASSWORD as string,
    DATABASE_LOGGING: process.env.DATABASE_LOGGING,
    LOG_LEVEL: process.env.LOG_LEVEL
}
import 'dotenv/config';

export default {
    PGDATABASE: process.env.TEST_PGDATABASE as string,
    PGHOST: process.env.TEST_PGHOST as string,
    PGPORT: process.env.TEST_PGPORT as string,
    PGUSER: process.env.TEST_PGUSER as string,
    PGPASSWORD: process.env.TEST_PGPASSWORD as string,
    DATABASE_LOGGING: process.env.TEST_DATABASE_LOGGING,
    LOG_LEVEL: process.env.TEST_LOG_LEVEL
}
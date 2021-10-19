import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableProductBatches1617554688090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            CREATE TABLE IF NOT EXISTS "products" (
                id SERIAL NOT NULL,
                name VARCHAR(50) NOT NULL,
                created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT "products_4101826545_pk" PRIMARY KEY ("id"),
                CONSTRAINT "product_name_3201826441_uq" UNIQUE ("name")
            );

            CREATE TABLE IF NOT EXISTS "product_batches" (
                id SERIAL NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 0,
                expiry TIMESTAMPTZ NOT NULL,
                created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT "product_batches_0681280550_pk" PRIMARY KEY ("id"),
                CONSTRAINT "product_id_expiry_uq" UNIQUE (product_id, expiry),
                CONSTRAINT "products_product_batches_0728947478_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
            );
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE ONLY "products", "product_batches" RESTART IDENTITY`);
    }

}

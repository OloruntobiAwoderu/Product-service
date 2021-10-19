import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTableProductBatchesAddColumnVersion1617799959676 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            ALTER TABLE IF EXISTS "product_batches"
            ADD COLUMN IF NOT EXISTS "version" INT DEFAULT 0;
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
        `
            ALTER TABLE IF EXISTS "product_batches"
            DROP COLUMN IF EXISTS "version";
            `
        );
    }

}

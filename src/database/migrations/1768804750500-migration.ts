import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768804750500 implements MigrationInterface {
    name = 'Migration1768804750500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "photo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "photo"`);
    }

}

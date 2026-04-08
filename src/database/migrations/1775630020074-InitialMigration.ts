import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1775630020074 implements MigrationInterface {
    name = 'InitialMigration1775630020074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e3caff3798d4eee252c7ce2fd7\` ON \`accounts\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`auth_provider\` \`auth_provider\` varchar(255) NOT NULL DEFAULT 'moc_digikey'`);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP COLUMN \`provider_id\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD \`provider_id\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e3caff3798d4eee252c7ce2fd7\` ON \`accounts\` (\`auth_provider\`, \`provider_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e3caff3798d4eee252c7ce2fd7\` ON \`accounts\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP COLUMN \`provider_id\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD \`provider_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`auth_provider\` \`auth_provider\` varchar(255) NOT NULL DEFAULT 'aas'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e3caff3798d4eee252c7ce2fd7\` ON \`accounts\` (\`auth_provider\`, \`provider_id\`)`);
    }

}

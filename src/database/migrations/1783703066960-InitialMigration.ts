import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1783703066960 implements MigrationInterface {
    name = 'InitialMigration1783703066960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auth_provider\` varchar(255) NOT NULL DEFAULT 'moc_digikey', \`provider_id\` char(36) NULL, \`password\` varchar(255) NULL, \`user_id\` int NULL, UNIQUE INDEX \`IDX_e3caff3798d4eee252c7ce2fd7\` (\`auth_provider\`, \`provider_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`profile_url\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`phone_number\` varchar(255) NULL, \`national_id\` varchar(255) NULL, \`dob\` varchar(255) NULL, \`full_name_km\` varchar(255) NULL, \`full_name_en\` varchar(255) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_3000dad1da61b29953f07476324\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_3000dad1da61b29953f07476324\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_e3caff3798d4eee252c7ce2fd7\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
    }

}

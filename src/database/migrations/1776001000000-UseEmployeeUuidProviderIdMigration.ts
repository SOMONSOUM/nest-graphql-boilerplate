import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseEmployeeUuidProviderIdMigration1776001000000 implements MigrationInterface {
  name = 'UseEmployeeUuidProviderIdMigration1776001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const foreignKeys: { CONSTRAINT_NAME: string }[] = await queryRunner.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'accounts'
        AND COLUMN_NAME = 'user_id'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    for (const foreignKey of foreignKeys) {
      await queryRunner.query(
        `ALTER TABLE \`accounts\` DROP FOREIGN KEY \`${foreignKey.CONSTRAINT_NAME}\``,
      );
    }

    await queryRunner.query(
      'DROP INDEX `IDX_e3caff3798d4eee252c7ce2fd7` ON `accounts`',
    );
    await queryRunner.query(
      'ALTER TABLE `accounts` MODIFY `provider_id` char(36) NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_e3caff3798d4eee252c7ce2fd7` ON `accounts` (`auth_provider`, `provider_id`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_e3caff3798d4eee252c7ce2fd7` ON `accounts`',
    );
    await queryRunner.query(
      'ALTER TABLE `accounts` MODIFY `provider_id` int NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_e3caff3798d4eee252c7ce2fd7` ON `accounts` (`auth_provider`, `provider_id`)',
    );
  }
}

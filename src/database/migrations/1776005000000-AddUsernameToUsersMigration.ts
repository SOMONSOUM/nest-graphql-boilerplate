import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameToUsersMigration1776005000000
  implements MigrationInterface
{
  name = 'AddUsernameToUsersMigration1776005000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns: { COLUMN_NAME: string }[] = await queryRunner.query(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'username'
    `);

    if (columns.length === 0) {
      await queryRunner.query(
        'ALTER TABLE `users` ADD `username` varchar(255) NULL',
      );
    }

    const indexes: { INDEX_NAME: string }[] = await queryRunner.query(`
      SELECT INDEX_NAME
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'username'
    `);

    if (indexes.length === 0) {
      await queryRunner.query(
        'CREATE UNIQUE INDEX `IDX_users_username` ON `users` (`username`)',
      );
    }

    await queryRunner.query(`
      UPDATE users
      SET username = email
      WHERE username IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const indexes: { INDEX_NAME: string }[] = await queryRunner.query(`
      SELECT INDEX_NAME
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND INDEX_NAME = 'IDX_users_username'
    `);

    if (indexes.length > 0) {
      await queryRunner.query('DROP INDEX `IDX_users_username` ON `users`');
    }

    const columns: { COLUMN_NAME: string }[] = await queryRunner.query(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'username'
    `);

    if (columns.length > 0) {
      await queryRunner.query('ALTER TABLE `users` DROP COLUMN `username`');
    }
  }
}

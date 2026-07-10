import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveProviderIdFromUsersToAccountsMigration1776004000000
  implements MigrationInterface
{
  name = 'MoveProviderIdFromUsersToAccountsMigration1776004000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns: { COLUMN_NAME: string }[] = await queryRunner.query(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'provider_id'
    `);

    if (columns.length === 0) {
      return;
    }

    await queryRunner.query(`
      INSERT INTO accounts (
        auth_provider,
        provider_id,
        user_id,
        created_at,
        updated_at
      )
      SELECT
        'moc_digikey',
        users.provider_id,
        users.id,
        NOW(),
        NOW()
      FROM users
      WHERE users.provider_id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM accounts
          WHERE accounts.auth_provider = 'moc_digikey'
            AND accounts.provider_id = users.provider_id
        )
    `);

    const indexes: { INDEX_NAME: string }[] = await queryRunner.query(`
      SELECT INDEX_NAME
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND INDEX_NAME = 'IDX_users_provider_id'
    `);

    if (indexes.length > 0) {
      await queryRunner.query('DROP INDEX `IDX_users_provider_id` ON `users`');
    }

    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `provider_id`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columns: { COLUMN_NAME: string }[] = await queryRunner.query(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'provider_id'
    `);

    if (columns.length === 0) {
      await queryRunner.query(
        'ALTER TABLE `users` ADD `provider_id` char(36) NULL',
      );
    }

    await queryRunner.query(`
      UPDATE users
      INNER JOIN accounts
        ON accounts.user_id = users.id
       AND accounts.auth_provider = 'moc_digikey'
      SET users.provider_id = accounts.provider_id
      WHERE users.provider_id IS NULL
        AND accounts.provider_id IS NOT NULL
    `);

    const indexes: { INDEX_NAME: string }[] = await queryRunner.query(`
      SELECT INDEX_NAME
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND INDEX_NAME = 'IDX_users_provider_id'
    `);

    if (indexes.length === 0) {
      await queryRunner.query(
        'CREATE UNIQUE INDEX `IDX_users_provider_id` ON `users` (`provider_id`)',
      );
    }
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdentityProfileFieldsToUsersMigration1776002000000 implements MigrationInterface {
  name = 'AddIdentityProfileFieldsToUsersMigration1776002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `provider_id` char(36) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `is_active` tinyint NOT NULL DEFAULT 1',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `profile_url` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `gender` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `phone_number` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `national_id` varchar(255) NULL',
    );
    await queryRunner.query('ALTER TABLE `users` ADD `dob` varchar(255) NULL');
    await queryRunner.query(
      'ALTER TABLE `users` ADD `full_name_km` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `full_name_en` varchar(255) NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_users_provider_id` ON `users` (`provider_id`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_users_provider_id` ON `users`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `full_name_en`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `full_name_km`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `dob`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `national_id`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `phone_number`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `gender`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `profile_url`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `is_active`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `provider_id`');
  }
}

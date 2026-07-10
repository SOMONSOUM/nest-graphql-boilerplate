import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignIdentityProfileFieldsWithClientUserMigration1776003000000 implements MigrationInterface {
  name = 'AlignIdentityProfileFieldsWithClientUserMigration1776003000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns: { COLUMN_NAME: string }[] = await queryRunner.query(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME IN ('employee_id', 'date_of_birth', 'dob', 'full_name', 'full_name_km')
    `);
    const columnNames = new Set(columns.map((column) => column.COLUMN_NAME));

    if (columnNames.has('employee_id')) {
      await queryRunner.query('ALTER TABLE `users` DROP COLUMN `employee_id`');
    }

    if (columnNames.has('date_of_birth') && !columnNames.has('dob')) {
      await queryRunner.query(
        'ALTER TABLE `users` CHANGE `date_of_birth` `dob` varchar(255) NULL',
      );
    }

    if (columnNames.has('full_name') && !columnNames.has('full_name_km')) {
      await queryRunner.query(
        'ALTER TABLE `users` CHANGE `full_name` `full_name_km` varchar(255) NULL',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columns: { COLUMN_NAME: string }[] = await queryRunner.query(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME IN ('employee_id', 'date_of_birth', 'dob', 'full_name', 'full_name_km')
    `);
    const columnNames = new Set(columns.map((column) => column.COLUMN_NAME));

    if (!columnNames.has('employee_id')) {
      await queryRunner.query('ALTER TABLE `users` ADD `employee_id` int NULL');
    }

    if (columnNames.has('dob') && !columnNames.has('date_of_birth')) {
      await queryRunner.query(
        'ALTER TABLE `users` CHANGE `dob` `date_of_birth` varchar(255) NULL',
      );
    }

    if (columnNames.has('full_name_km') && !columnNames.has('full_name')) {
      await queryRunner.query(
        'ALTER TABLE `users` CHANGE `full_name_km` `full_name` varchar(255) NULL',
      );
    }
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPositionToUsersMigration1784000000000
  implements MigrationInterface
{
  name = 'AddPositionToUsersMigration1784000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `position` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `position`');
  }
}

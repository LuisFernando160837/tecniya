import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEquipoFields1700000000001 implements MigrationInterface {
  name = 'AddEquipoFields1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "solicitudes_servicio"
      ADD COLUMN "tipo_equipo" varchar(100)
    `);
    await queryRunner.query(`
      ALTER TABLE "solicitudes_servicio"
      ADD COLUMN "marca" varchar(100)
    `);
    await queryRunner.query(`
      ALTER TABLE "solicitudes_servicio"
      ADD COLUMN "modelo" varchar(200)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "solicitudes_servicio"
      DROP COLUMN "tipo_equipo"
    `);
    await queryRunner.query(`
      ALTER TABLE "solicitudes_servicio"
      DROP COLUMN "marca"
    `);
    await queryRunner.query(`
      ALTER TABLE "solicitudes_servicio"
      DROP COLUMN "modelo"
    `);
  }
}

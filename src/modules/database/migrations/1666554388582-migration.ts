import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1666554388582 implements MigrationInterface {
  name = 'migration1666554388582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN CREATE TYPE "public"."user_provider_enum" AS ENUM('email', 'google'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "provider" "public"."user_provider_enum" NOT NULL DEFAULT 'email', "googleId" character varying, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying, "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{user}', CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
  }
}

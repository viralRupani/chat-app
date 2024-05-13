import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1715617134860 implements MigrationInterface {
    name = 'Init1715617134860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "about" character varying(100) NOT NULL, "phone" numeric NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_type_enum" AS ENUM('REGISTER_USER', 'FORGOT_PASSWORD')`);
        await queryRunner.query(`CREATE TABLE "otp" ("otp" character varying NOT NULL, "user_id" integer NOT NULL, "type" "public"."otp_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89b6214c8f25d6332dc6fc20313" PRIMARY KEY ("otp", "user_id"))`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_258d028d322ea3b856bf9f12f25"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

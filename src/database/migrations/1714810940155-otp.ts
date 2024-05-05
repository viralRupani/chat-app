import { MigrationInterface, QueryRunner } from 'typeorm';

export class Otp1714810940155 implements MigrationInterface {
    name = 'Otp1714810940155';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."otp_type_enum" AS ENUM('REGISTER_USER')`,
        );
        await queryRunner.query(
            `CREATE TABLE "otp" ("otp" character varying NOT NULL, "user_id" integer NOT NULL, "type" "public"."otp_type_enum" NOT NULL, CONSTRAINT "PK_89b6214c8f25d6332dc6fc20313" PRIMARY KEY ("otp", "user_id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "otp" ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "otp" DROP CONSTRAINT "FK_258d028d322ea3b856bf9f12f25"`,
        );
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
    }
}

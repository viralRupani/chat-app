import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpChanges1714906873087 implements MigrationInterface {
    name = 'OtpChanges1714906873087';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."otp_type_enum" RENAME TO "otp_type_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."otp_type_enum" AS ENUM('REGISTER_USER', 'FORGOT_PASSWORD')`,
        );
        await queryRunner.query(
            `ALTER TABLE "otp" ALTER COLUMN "type" TYPE "public"."otp_type_enum" USING "type"::"text"::"public"."otp_type_enum"`,
        );
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."otp_type_enum_old" AS ENUM('REGISTER_USER')`,
        );
        await queryRunner.query(
            `ALTER TABLE "otp" ALTER COLUMN "type" TYPE "public"."otp_type_enum_old" USING "type"::"text"::"public"."otp_type_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."otp_type_enum_old" RENAME TO "otp_type_enum"`,
        );
    }
}

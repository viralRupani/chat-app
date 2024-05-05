import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpCreatedAt1714818361259 implements MigrationInterface {
    name = 'OtpCreatedAt1714818361259';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "otp" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "created_at"`);
    }
}

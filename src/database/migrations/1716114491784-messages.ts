import { MigrationInterface, QueryRunner } from 'typeorm';

export class Messages1716114491784 implements MigrationInterface {
    name = 'Messages1716114491784';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "message" ("created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "createdById" uuid, "chatId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "message" ADD CONSTRAINT "FK_ebb9ef96e3dcc73ac0366824935" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "message" DROP CONSTRAINT "FK_ebb9ef96e3dcc73ac0366824935"`,
        );
        await queryRunner.query(`DROP TABLE "message"`);
    }
}

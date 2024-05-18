import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1715970601410 implements MigrationInterface {
    name = 'Init1715970601410';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."chat_chat_type_enum" AS ENUM('group', 'direct_message')`,
        );
        await queryRunner.query(
            `CREATE TABLE "chat" ("created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" character varying(200) NOT NULL, "profile" character varying NOT NULL, "chat_type" "public"."chat_chat_type_enum" NOT NULL DEFAULT 'direct_message', "createdById" uuid, CONSTRAINT "UQ_ba2b6fc4d1a8d790c58484853bf" UNIQUE ("profile"), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."chat_user_mapping_role_enum" AS ENUM('member', 'admin')`,
        );
        await queryRunner.query(
            `CREATE TABLE "chat_user_mapping" ("created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "chat_id" uuid NOT NULL, "role" "public"."chat_user_mapping_role_enum" NOT NULL DEFAULT 'member', CONSTRAINT "PK_2a77bdd1d58e4ddb17b396dd1d2" PRIMARY KEY ("user_id", "chat_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "about" character varying(100) NOT NULL, "phone" numeric NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."otp_type_enum" AS ENUM('REGISTER_USER', 'FORGOT_PASSWORD')`,
        );
        await queryRunner.query(
            `CREATE TABLE "otp" ("otp" character varying NOT NULL, "user_id" uuid NOT NULL, "type" "public"."otp_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89b6214c8f25d6332dc6fc20313" PRIMARY KEY ("otp", "user_id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat" ADD CONSTRAINT "FK_1d6d6ef6d2b7b20dd032946aeec" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_user_mapping" ADD CONSTRAINT "FK_3f02f1481b11b3d887f1fa9543a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_user_mapping" ADD CONSTRAINT "FK_8f3795d1f89512f242b69fce4e2" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "otp" ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "otp" DROP CONSTRAINT "FK_258d028d322ea3b856bf9f12f25"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_user_mapping" DROP CONSTRAINT "FK_8f3795d1f89512f242b69fce4e2"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_user_mapping" DROP CONSTRAINT "FK_3f02f1481b11b3d887f1fa9543a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat" DROP CONSTRAINT "FK_1d6d6ef6d2b7b20dd032946aeec"`,
        );
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "chat_user_mapping"`);
        await queryRunner.query(
            `DROP TYPE "public"."chat_user_mapping_role_enum"`,
        );
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TYPE "public"."chat_chat_type_enum"`);
    }
}

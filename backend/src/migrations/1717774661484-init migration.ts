import {MigrationInterface, QueryRunner} from "typeorm";

export class initMigration1717774661484 implements MigrationInterface {
    name = 'initMigration1717774661484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "local_file" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "originalname" character varying NOT NULL, CONSTRAINT "PK_e391e00bc7475063fd45ee3f38d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "surname"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "currentUserName"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "recipientUserName"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isOnline" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "recoveryCode" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bannedBy" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "file" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "reactions" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`CREATE TYPE "public"."messages_status_enum" AS ENUM('isSent', 'isDelivered', 'isRead')`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "status" "public"."messages_status_enum"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "readBy" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "isForwarded" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "modified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "contactId" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "parentMessageId" uuid`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "admin" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "participants" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "PK_18325f38ae6de43878487eff986"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "message" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "name" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_435f12bd11014722a707a292763" FOREIGN KEY ("contactId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_379d3b2679ddf515e5a90de0153" FOREIGN KEY ("parentMessageId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_379d3b2679ddf515e5a90de0153"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_435f12bd11014722a707a292763"`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "message" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "PK_18325f38ae6de43878487eff986"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "participants"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "admin"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "parentMessageId"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "contactId"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "modified"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "isForwarded"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "readBy"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."messages_status_enum"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "reactions"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "file"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bannedBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "recoveryCode"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isOnline"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "recipientUserName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "currentUserName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "color" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "surname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "local_file"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThumbnailMediaIdToTemplates1768760944336 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 添加 thumbnail_media_id 字段
        await queryRunner.query(`
            ALTER TABLE \`templates\`
            ADD COLUMN \`thumbnail_media_id\` int NULL
        `);

        // 添加外键约束
        await queryRunner.query(`
            ALTER TABLE \`templates\`
            ADD CONSTRAINT \`FK_templates_thumbnail_media\`
            FOREIGN KEY (\`thumbnail_media_id\`)
            REFERENCES \`media\`(\`id\`)
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除外键约束
        await queryRunner.query(`
            ALTER TABLE \`templates\`
            DROP FOREIGN KEY \`FK_templates_thumbnail_media\`
        `);

        // 删除字段
        await queryRunner.query(`
            ALTER TABLE \`templates\`
            DROP COLUMN \`thumbnail_media_id\`
        `);
    }

}

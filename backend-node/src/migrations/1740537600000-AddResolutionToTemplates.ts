import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResolutionToTemplates1740537600000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 添加 resolution 字段
        await queryRunner.query(`
            ALTER TABLE \`templates\`
            ADD COLUMN \`resolution\` varchar(50) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除字段
        await queryRunner.query(`
            ALTER TABLE \`templates\`
            DROP COLUMN \`resolution\`
        `);
    }

}

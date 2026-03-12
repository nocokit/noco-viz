/**
 * 角色权限数据填充脚本
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'noco_viz_db',
};

// 定义角色权限数据
const rolePermissions = {
  super_admin: {
    name: '超级管理员',
    description: '拥有系统所有权限，可管理所有模块和数据',
    scope: 'all',
    isSystem: true,
    permissions: {
      users: { all: true, view: true, create: true, edit: true, delete: true },
      roles: { all: true, view: true, create: true, edit: true, delete: true },
      projects: { all: true, view: true, create: true, edit: true, delete: true, publish: true },
      templates: { all: true, view: true, create: true, edit: true, delete: true, publish: true },
      datasets: { all: true, view: true, create: true, edit: true, delete: true },
      connections: { all: true, view: true, create: true, edit: true, delete: true },
      media: { all: true, view: true, upload: true, edit: true, delete: true },
      components: { all: true, view: true, create: true, edit: true, delete: true },
      system: { all: true, view: true, config: true, backup: true, restore: true },
      security: { all: true, view: true, config: true }
    }
  },
  admin: {
    name: '管理员',
    description: '拥有大部分管理权限，可管理用户、角色和业务数据',
    scope: 'all',
    isSystem: true,
    permissions: {
      users: { all: true, view: true, create: true, edit: true, delete: true },
      roles: { all: true, view: true, create: true, edit: true, delete: true },
      projects: { all: true, view: true, create: true, edit: true, delete: true, publish: true },
      templates: { all: true, view: true, create: true, edit: true, delete: true, publish: true },
      datasets: { all: true, view: true, create: true, edit: true, delete: true },
      connections: { all: true, view: true, create: true, edit: true, delete: true },
      media: { all: true, view: true, upload: true, edit: true, delete: true },
      components: { all: true, view: true, create: true, edit: true, delete: true },
      system: { all: false, view: true, config: false, backup: true, restore: false },
      security: { all: false, view: true, config: false }
    }
  },
  editor: {
    name: '编辑者',
    description: '可创建和编辑内容，但不能删除或发布',
    scope: 'dept',
    isSystem: false,
    permissions: {
      users: { all: false, view: true, create: false, edit: false, delete: false },
      roles: { all: false, view: true, create: false, edit: false, delete: false },
      projects: { all: false, view: true, create: true, edit: true, delete: false, publish: false },
      templates: { all: false, view: true, create: true, edit: true, delete: false, publish: false },
      datasets: { all: false, view: true, create: true, edit: true, delete: false },
      connections: { all: false, view: true, create: false, edit: false, delete: false },
      media: { all: false, view: true, upload: true, edit: true, delete: false },
      components: { all: false, view: true, create: true, edit: true, delete: false },
      system: { all: false, view: false, config: false, backup: false, restore: false },
      security: { all: false, view: false, config: false }
    }
  },
  viewer: {
    name: '查看者',
    description: '只能查看内容，无编辑权限',
    scope: 'self',
    isSystem: false,
    permissions: {
      users: { all: false, view: false, create: false, edit: false, delete: false },
      roles: { all: false, view: false, create: false, edit: false, delete: false },
      projects: { all: false, view: true, create: false, edit: false, delete: false, publish: false },
      templates: { all: false, view: true, create: false, edit: false, delete: false, publish: false },
      datasets: { all: false, view: true, create: false, edit: false, delete: false },
      connections: { all: false, view: false, create: false, edit: false, delete: false },
      media: { all: false, view: true, upload: false, edit: false, delete: false },
      components: { all: false, view: true, create: false, edit: false, delete: false },
      system: { all: false, view: false, config: false, backup: false, restore: false },
      security: { all: false, view: false, config: false }
    }
  },
  analyst: {
    name: '数据分析师',
    description: '专注于数据分析，可管理数据集和连接',
    scope: 'dept',
    isSystem: false,
    permissions: {
      users: { all: false, view: true, create: false, edit: false, delete: false },
      roles: { all: false, view: false, create: false, edit: false, delete: false },
      projects: { all: false, view: true, create: true, edit: true, delete: false, publish: false },
      templates: { all: false, view: true, create: false, edit: false, delete: false, publish: false },
      datasets: { all: true, view: true, create: true, edit: true, delete: true },
      connections: { all: true, view: true, create: true, edit: true, delete: true },
      media: { all: false, view: true, upload: false, edit: false, delete: false },
      components: { all: false, view: true, create: false, edit: false, delete: false },
      system: { all: false, view: false, config: false, backup: false, restore: false },
      security: { all: false, view: false, config: false }
    }
  },
  project_manager: {
    name: '项目经理',
    description: '可管理项目和团队，发布内容',
    scope: 'dept',
    isSystem: false,
    permissions: {
      users: { all: false, view: true, create: false, edit: true, delete: false },
      roles: { all: false, view: true, create: false, edit: false, delete: false },
      projects: { all: true, view: true, create: true, edit: true, delete: true, publish: true },
      templates: { all: false, view: true, create: true, edit: true, delete: false, publish: true },
      datasets: { all: false, view: true, create: true, edit: true, delete: false },
      connections: { all: false, view: true, create: false, edit: false, delete: false },
      media: { all: false, view: true, upload: true, edit: true, delete: true },
      components: { all: false, view: true, create: true, edit: true, delete: false },
      system: { all: false, view: false, config: false, backup: false, restore: false },
      security: { all: false, view: false, config: false }
    }
  }
};

async function seedRolePermissions() {
  let connection;

  try {
    console.log('🔐 开始填充角色权限数据...\n');

    connection = await mysql.createConnection(dbConfig);
    console.log('✓ 数据库连接成功');

    console.log('\n📝 更新角色权限...');

    for (const [key, data] of Object.entries(rolePermissions)) {
      const value = JSON.stringify(data);

      await connection.execute(
        `UPDATE roles SET value = ?, description = ? WHERE \`key\` = ?`,
        [value, data.description, key]
      );

      console.log(`  ✓ 更新角色: ${data.name} (${key})`);
    }

    console.log('\n✅ 角色权限数据填充完成！\n');
    console.log('📊 已更新角色:');
    Object.entries(rolePermissions).forEach(([key, data]) => {
      console.log(`   - ${data.name} (${key}): ${data.description}`);
    });
    console.log('');

  } catch (error) {
    console.error('\n❌ 填充失败:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行填充
if (require.main === module) {
  seedRolePermissions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedRolePermissions };

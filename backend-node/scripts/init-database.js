/**
 * 数据库初始化脚本
 * 创建数据库表结构和基础配置
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

async function initDatabase() {
  let connection;

  try {
    console.log('🚀 开始初始化数据库...\n');

    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ 数据库连接成功');

    // 1. 清空现有数据（保留表结构）
    console.log('\n📋 清空现有数据...');

    const tables = [
      'recycle_bin',
      'backups',
      'media',
      'playlists',
      'templates',
      'datasets',
      'connections',
      'projects',
      'ip_whitelist',
      'system_config',
      'users',
      'roles'
    ];

    for (const table of tables) {
      try {
        await connection.execute(`DELETE FROM ${table}`);
        console.log(`  ✓ 清空表: ${table}`);
      } catch (error) {
        console.log(`  ⚠ 表不存在或清空失败: ${table}`);
      }
    }

    // 2. 重置自增ID
    console.log('\n🔄 重置自增ID...');
    for (const table of tables) {
      try {
        await connection.execute(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
        console.log(`  ✓ 重置: ${table}`);
      } catch (error) {
        // 忽略错误
      }
    }

    // 3. 创建默认角色
    console.log('\n👥 创建默认角色...');

    const roles = [
      {
        name: '超级管理员',
        description: '系统超级管理员，拥有所有权限',
        scope: 'all',
        permissions: JSON.stringify({
          users: ['view', 'create', 'edit', 'delete'],
          roles: ['view', 'create', 'edit', 'delete'],
          projects: ['view', 'create', 'edit', 'delete', 'publish'],
          templates: ['view', 'create', 'edit', 'delete', 'publish'],
          datasets: ['view', 'create', 'edit', 'delete'],
          connections: ['view', 'create', 'edit', 'delete'],
          media: ['view', 'upload', 'delete'],
          playlists: ['view', 'create', 'edit', 'delete'],
          system: ['view', 'config', 'backup', 'restore'],
          security: ['view', 'config']
        }),
        is_system: true
      },
      {
        name: '管理员',
        description: '系统管理员，拥有大部分权限',
        scope: 'all',
        permissions: JSON.stringify({
          users: ['view', 'create', 'edit'],
          roles: ['view'],
          projects: ['view', 'create', 'edit', 'delete', 'publish'],
          templates: ['view', 'create', 'edit', 'delete'],
          datasets: ['view', 'create', 'edit', 'delete'],
          connections: ['view', 'create', 'edit', 'delete'],
          media: ['view', 'upload', 'delete'],
          playlists: ['view', 'create', 'edit', 'delete'],
          system: ['view'],
          security: ['view']
        }),
        is_system: true
      },
      {
        name: '编辑者',
        description: '内容编辑者，可以创建和编辑内容',
        scope: 'dept',
        permissions: JSON.stringify({
          projects: ['view', 'create', 'edit'],
          templates: ['view', 'create', 'edit'],
          datasets: ['view', 'create', 'edit'],
          connections: ['view'],
          media: ['view', 'upload'],
          playlists: ['view', 'create', 'edit']
        }),
        is_system: true
      },
      {
        name: '查看者',
        description: '只读用户，只能查看内容',
        scope: 'self',
        permissions: JSON.stringify({
          projects: ['view'],
          templates: ['view'],
          datasets: ['view'],
          connections: ['view'],
          media: ['view'],
          playlists: ['view']
        }),
        is_system: true
      }
    ];

    for (const role of roles) {
      await connection.execute(
        `INSERT INTO roles (name, description, scope, permissions, is_system, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [role.name, role.description, role.scope, role.permissions, role.is_system]
      );
      console.log(`  ✓ 创建角色: ${role.name}`);
    }

    // 4. 创建默认管理员用户
    console.log('\n👤 创建默认管理员用户...');

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('123456', 10);

    await connection.execute(
      `INSERT INTO users (username, email, password, first_name, last_name, role_id, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['admin', 'admin@example.com', hashedPassword, 'Admin', 'User', 1, true]
    );
    console.log('  ✓ 创建管理员账号: admin / 123456');

    // 5. 创建系统配置
    console.log('\n⚙️  创建系统配置...');

    const systemConfigs = [
      { key: 'site_name', value: 'NocoViz 数据可视化平台', description: '网站名称' },
      { key: 'site_logo', value: '', description: '网站Logo' },
      { key: 'site_description', value: '专业的数据可视化解决方案', description: '网站描述' },
      { key: 'enable_registration', value: 'true', description: '是否允许用户注册' },
      { key: 'default_role', value: '4', description: '新用户默认角色ID' },
      { key: 'session_timeout', value: '7200', description: '会话超时时间（秒）' },
      { key: 'max_upload_size', value: '10485760', description: '最大上传文件大小（字节）' },
      { key: 'allowed_file_types', value: 'jpg,jpeg,png,gif,svg,pdf,doc,docx,xls,xlsx,csv', description: '允许上传的文件类型' },
      { key: 'backup_enabled', value: 'true', description: '是否启用自动备份' },
      { key: 'backup_frequency', value: 'daily', description: '备份频率' },
      { key: 'backup_retention_days', value: '30', description: '备份保留天数' },
      { key: 'email_enabled', value: 'false', description: '是否启用邮件功能' },
      { key: 'email_host', value: '', description: 'SMTP服务器地址' },
      { key: 'email_port', value: '587', description: 'SMTP端口' },
      { key: 'email_user', value: '', description: '邮箱账号' },
      { key: 'email_password', value: '', description: '邮箱密码' },
      { key: 'theme', value: 'dark', description: '默认主题' },
      { key: 'language', value: 'zh-CN', description: '默认语言' }
    ];

    for (const config of systemConfigs) {
      await connection.execute(
        `INSERT INTO system_config (\`key\`, \`value\`, description, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [config.key, config.value, config.description]
      );
    }
    console.log(`  ✓ 创建 ${systemConfigs.length} 个系统配置项`);

    console.log('\n✅ 数据库初始化完成！\n');
    console.log('📝 默认管理员账号:');
    console.log('   用户名: admin');
    console.log('   密码: 123456\n');

  } catch (error) {
    console.error('\n❌ 初始化失败:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行初始化
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { initDatabase };

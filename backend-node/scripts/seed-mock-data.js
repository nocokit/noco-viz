/**
 * Mock 数据填充脚本
 * 为演示目的填充示例数据
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'noco_viz_db',
};

async function seedMockData() {
  let connection;

  try {
    console.log('🌱 开始填充 Mock 数据...\n');

    connection = await mysql.createConnection(dbConfig);
    console.log('✓ 数据库连接成功');

    // 1. 创建测试用户
    console.log('\n👥 创建测试用户...');

    const testUsers = [
      { username: 'editor1', email: 'editor1@example.com', firstName: '张', lastName: '编辑', roleId: 3 },
      { username: 'editor2', email: 'editor2@example.com', firstName: '李', lastName: '编辑', roleId: 3 },
      { username: 'viewer1', email: 'viewer1@example.com', firstName: '王', lastName: '查看', roleId: 4 },
      { username: 'admin2', email: 'admin2@example.com', firstName: '赵', lastName: '管理', roleId: 2 }
    ];

    const hashedPassword = await bcrypt.hash('123456', 10);

    for (const user of testUsers) {
      await connection.execute(
        `INSERT INTO users (username, email, password, first_name, last_name, role_id, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [user.username, user.email, hashedPassword, user.firstName, user.lastName, user.roleId, true]
      );
      console.log(`  ✓ 创建用户: ${user.username}`);
    }

    // 2. 创建数据连接
    console.log('\n🔌 创建数据连接...');

    const connections = [
      {
        name: 'MySQL 生产数据库',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'production_db',
        username: 'prod_user',
        status: 'connected'
      },
      {
        name: 'PostgreSQL 分析库',
        type: 'postgresql',
        host: 'analytics.example.com',
        port: 5432,
        database: 'analytics',
        username: 'analyst',
        status: 'connected'
      },
      {
        name: 'Oracle 数据仓库',
        type: 'oracle',
        host: 'oracle.example.com',
        port: 1521,
        database: 'warehouse',
        username: 'dw_user',
        status: 'disconnected'
      },
      {
        name: 'SQL Server 报表库',
        type: 'sqlserver',
        host: 'sqlserver.example.com',
        port: 1433,
        database: 'reports',
        username: 'report_user',
        status: 'connected'
      }
    ];

    for (const conn of connections) {
      await connection.execute(
        `INSERT INTO connections (name, type, host, port, \`database\`, username, password, status, created_by_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [conn.name, conn.type, conn.host, conn.port, conn.database, conn.username, '', conn.status, 1]
      );
      console.log(`  ✓ 创建连接: ${conn.name}`);
    }

    // 3. 创建数据集
    console.log('\n📊 创建数据集...');

    const datasets = [
      {
        name: '销售数据统计',
        type: 'sql',
        config: JSON.stringify({
          connectionId: 1,
          query: 'SELECT date, product, sales, revenue FROM sales_data WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
        }),
        fields: JSON.stringify([
          { name: 'date', type: 'date' },
          { name: 'product', type: 'string' },
          { name: 'sales', type: 'number' },
          { name: 'revenue', type: 'number' }
        ]),
        rowCount: 150,
        status: 'active'
      },
      {
        name: '用户行为分析',
        type: 'sql',
        config: JSON.stringify({
          connectionId: 2,
          query: 'SELECT user_id, action, timestamp FROM user_actions WHERE timestamp >= NOW() - INTERVAL \'7 days\''
        }),
        fields: JSON.stringify([
          { name: 'user_id', type: 'number' },
          { name: 'action', type: 'string' },
          { name: 'timestamp', type: 'datetime' }
        ]),
        rowCount: 5420,
        status: 'active'
      },
      {
        name: '产品库存数据',
        type: 'api',
        config: JSON.stringify({
          url: 'https://api.example.com/inventory',
          method: 'GET',
          headers: {}
        }),
        fields: JSON.stringify([
          { name: 'product_id', type: 'number' },
          { name: 'product_name', type: 'string' },
          { name: 'stock', type: 'number' }
        ]),
        rowCount: 89,
        status: 'active'
      },
      {
        name: '网站流量统计',
        type: 'excel',
        config: JSON.stringify({
          data: [
            { day: '周一', visits: 1200 },
            { day: '周二', visits: 1500 },
            { day: '周三', visits: 1800 },
            { day: '周四', visits: 2100 },
            { day: '周五', visits: 2400 },
            { day: '周六', visits: 2800 },
            { day: '周日', visits: 2600 }
          ]
        }),
        fields: JSON.stringify([
          { name: 'day', type: 'string' },
          { name: 'visits', type: 'number' }
        ]),
        rowCount: 7,
        status: 'active'
      },
      {
        name: '销售额趋势',
        type: 'excel',
        config: JSON.stringify({
          data: [
            { month: '1月', sales: 45000 },
            { month: '2月', sales: 52000 },
            { month: '3月', sales: 61000 },
            { month: '4月', sales: 58000 },
            { month: '5月', sales: 67000 },
            { month: '6月', sales: 73000 }
          ]
        }),
        fields: JSON.stringify([
          { name: 'month', type: 'string' },
          { name: 'sales', type: 'number' }
        ]),
        rowCount: 6,
        status: 'active'
      }
    ];

    for (const dataset of datasets) {
      await connection.execute(
        `INSERT INTO datasets (name, type, config, fields, row_count, status, created_by_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [dataset.name, dataset.type, dataset.config, dataset.fields, dataset.rowCount, dataset.status, 1]
      );
      console.log(`  ✓ 创建数据集: ${dataset.name}`);
    }

    // 4. 创建模板
    console.log('\n📐 创建模板...');

    const templates = [
      {
        title: '销售仪表板',
        category: 'dashboard',
        description: '展示销售数据的综合仪表板，包含多个图表组件',
        thumbnail: '/uploads/templates/sales-dashboard.svg',
        config: JSON.stringify({
          layout: 'grid',
          components: [
            { type: 'bar', title: '月度销售额', datasetId: 5, position: { x: 0, y: 0, w: 6, h: 4 } },
            { type: 'line', title: '销售趋势', datasetId: 1, position: { x: 6, y: 0, w: 6, h: 4 } },
            { type: 'pie', title: '产品占比', datasetId: 1, position: { x: 0, y: 4, w: 4, h: 4 } }
          ]
        }),
        status: 'published',
        isOfficial: true
      },
      {
        title: '用户分析报表',
        category: 'report',
        description: '用户行为分析报表模板',
        thumbnail: '/uploads/templates/user-analytics.svg',
        config: JSON.stringify({
          layout: 'vertical',
          components: [
            { type: 'line', title: '日活跃用户', datasetId: 2 },
            { type: 'bar', title: '用户来源分布', datasetId: 2 },
            { type: 'table', title: '用户行为明细', datasetId: 2 }
          ]
        }),
        status: 'published',
        isOfficial: true
      },
      {
        title: '库存监控大屏',
        category: 'chart',
        description: '实时库存监控大屏模板',
        thumbnail: '/uploads/templates/inventory-screen.svg',
        config: JSON.stringify({
          layout: 'fullscreen',
          theme: 'dark',
          components: [
            { type: 'number', title: '总库存', datasetId: 3, style: 'large' },
            { type: 'gauge', title: '库存预警', datasetId: 3 },
            { type: 'bar', title: '分类库存', datasetId: 3 }
          ]
        }),
        status: 'published',
        isOfficial: true
      },
      {
        title: '网站流量分析',
        category: 'dashboard',
        description: '网站流量数据分析仪表板',
        thumbnail: '/uploads/templates/traffic-dashboard.svg',
        config: JSON.stringify({
          layout: 'grid',
          components: [
            { type: 'line', title: '每周访问量', datasetId: 4, position: { x: 0, y: 0, w: 8, h: 4 } },
            { type: 'pie', title: '流量来源', datasetId: 4, position: { x: 8, y: 0, w: 4, h: 4 } }
          ]
        }),
        status: 'published',
        isOfficial: false
      },
      {
        title: '财务报表',
        category: 'report',
        description: '企业财务数据报表模板',
        thumbnail: '/uploads/templates/financial-report.svg',
        config: JSON.stringify({
          layout: 'vertical',
          components: [
            { type: 'table', title: '收支明细' },
            { type: 'bar', title: '月度对比' },
            { type: 'line', title: '利润趋势' }
          ]
        }),
        status: 'draft',
        isOfficial: false
      }
    ];

    for (const template of templates) {
      await connection.execute(
        `INSERT INTO templates (title, description, category, thumbnail, config, status, is_official, created_by_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [template.title, template.description, template.category, template.thumbnail,
         template.config, template.status, template.isOfficial, 1]
      );
      console.log(`  ✓ 创建模板: ${template.title}`);
    }

    // 5. 创建项目
    console.log('\n📁 创建项目...');

    const projects = [
      {
        title: '2024年度销售分析',
        type: 'screen',
        description: '2024年全年销售数据分析项目',
        coverImage: '/uploads/projects/sales-2024.svg',
        status: 'published',
        config: JSON.stringify({
          theme: 'light',
          autoRefresh: true,
          refreshInterval: 300,
          templateId: 1
        })
      },
      {
        title: '用户增长报告',
        type: 'report',
        description: 'Q1季度用户增长数据报告',
        coverImage: '/uploads/projects/user-growth.svg',
        status: 'published',
        config: JSON.stringify({
          theme: 'light',
          autoRefresh: false,
          templateId: 2
        })
      },
      {
        title: '仓库库存监控',
        type: 'screen',
        description: '实时仓库库存监控大屏',
        coverImage: '/uploads/projects/inventory-monitor.svg',
        status: 'published',
        config: JSON.stringify({
          theme: 'dark',
          autoRefresh: true,
          refreshInterval: 60,
          templateId: 3
        })
      },
      {
        title: '网站运营数据',
        type: 'screen',
        description: '网站日常运营数据看板',
        coverImage: '/uploads/projects/website-ops.svg',
        status: 'draft',
        config: JSON.stringify({
          theme: 'light',
          autoRefresh: true,
          refreshInterval: 600,
          templateId: 4
        })
      }
    ];

    for (const project of projects) {
      await connection.execute(
        `INSERT INTO projects (title, type, description, cover_image, status, config, created_by_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [project.title, project.type, project.description, project.coverImage, project.status, project.config, 1]
      );
      console.log(`  ✓ 创建项目: ${project.title}`);
    }

    // 6. 创建媒体文件
    console.log('\n🖼️  创建媒体文件...');

    const mediaFiles = [
      {
        name: 'company-logo.png',
        url: '/uploads/images/company-logo.png',
        path: '/uploads/images/company-logo.png',
        type: 'image',
        mimeType: 'image/png',
        size: 45678,
        width: 200,
        height: 80,
        category: 'logo',
        description: '公司Logo'
      },
      {
        name: 'sales-chart-bg.jpg',
        url: '/uploads/images/sales-chart-bg.jpg',
        path: '/uploads/images/sales-chart-bg.jpg',
        type: 'image',
        mimeType: 'image/jpeg',
        size: 123456,
        width: 1920,
        height: 1080,
        category: 'background',
        description: '销售图表背景图'
      },
      {
        name: 'dashboard-template.json',
        url: '/uploads/files/dashboard-template.json',
        path: '/uploads/files/dashboard-template.json',
        type: 'document',
        mimeType: 'application/json',
        size: 8765,
        category: 'template',
        description: '仪表板模板文件'
      },
      {
        name: 'product-data.csv',
        url: '/uploads/files/product-data.csv',
        path: '/uploads/files/product-data.csv',
        type: 'document',
        mimeType: 'text/csv',
        size: 234567,
        category: 'data',
        description: '产品数据CSV文件'
      },
      {
        name: 'intro-video.mp4',
        url: '/uploads/videos/intro-video.mp4',
        path: '/uploads/videos/intro-video.mp4',
        type: 'video',
        mimeType: 'video/mp4',
        size: 5678901,
        width: 1920,
        height: 1080,
        category: 'video',
        description: '产品介绍视频'
      },
      // 模板封面图
      {
        name: 'sales-dashboard.svg',
        url: '/uploads/templates/sales-dashboard.svg',
        path: '/uploads/templates/sales-dashboard.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'template-cover',
        description: '销售仪表板封面图'
      },
      {
        name: 'user-analytics.svg',
        url: '/uploads/templates/user-analytics.svg',
        path: '/uploads/templates/user-analytics.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'template-cover',
        description: '用户分析报表封面图'
      },
      {
        name: 'inventory-screen.svg',
        url: '/uploads/templates/inventory-screen.svg',
        path: '/uploads/templates/inventory-screen.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'template-cover',
        description: '库存监控大屏封面图'
      },
      {
        name: 'traffic-dashboard.svg',
        url: '/uploads/templates/traffic-dashboard.svg',
        path: '/uploads/templates/traffic-dashboard.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'template-cover',
        description: '网站流量分析封面图'
      },
      {
        name: 'financial-report.svg',
        url: '/uploads/templates/financial-report.svg',
        path: '/uploads/templates/financial-report.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'template-cover',
        description: '财务报表封面图'
      },
      // 项目封面图
      {
        name: 'sales-2024.svg',
        url: '/uploads/projects/sales-2024.svg',
        path: '/uploads/projects/sales-2024.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'project-cover',
        description: '2024年度销售分析封面图'
      },
      {
        name: 'user-growth.svg',
        url: '/uploads/projects/user-growth.svg',
        path: '/uploads/projects/user-growth.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'project-cover',
        description: '用户增长报告封面图'
      },
      {
        name: 'inventory-monitor.svg',
        url: '/uploads/projects/inventory-monitor.svg',
        path: '/uploads/projects/inventory-monitor.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'project-cover',
        description: '仓库库存监控封面图'
      },
      {
        name: 'website-ops.svg',
        url: '/uploads/projects/website-ops.svg',
        path: '/uploads/projects/website-ops.svg',
        type: 'image',
        mimeType: 'image/svg+xml',
        size: 758,
        category: 'project-cover',
        description: '网站运营数据封面图'
      }
    ];

    for (const media of mediaFiles) {
      await connection.execute(
        `INSERT INTO media (name, url, path, type, mimeType, size, width, height, category, description, user_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [media.name, media.url, media.path, media.type, media.mimeType, media.size,
         media.width || null, media.height || null, media.category, media.description, 1]
      );
      console.log(`  ✓ 创建媒体: ${media.name}`);
    }

    // 7. 创建播放列表
    console.log('\n📺 创建播放列表...');

    const playlists = [
      {
        name: '销售数据展示',
        status: 'idle',
        resolution: '1920x1080',
        url: '/playlists/sales-display',
        transition: 'fade',
        slides: JSON.stringify([
          { projectId: 1, duration: 10 },
          { projectId: 2, duration: 10 }
        ])
      },
      {
        name: '运营监控大屏',
        status: 'playing',
        resolution: '3840x2160',
        url: '/playlists/ops-monitor',
        transition: 'slide',
        slides: JSON.stringify([
          { projectId: 3, duration: 15 },
          { projectId: 4, duration: 15 }
        ])
      },
      {
        name: '月度汇报',
        status: 'idle',
        resolution: '1920x1080',
        url: '/playlists/monthly-report',
        transition: 'none',
        slides: JSON.stringify([
          { projectId: 1, duration: 20 },
          { projectId: 2, duration: 20 }
        ])
      }
    ];

    for (const playlist of playlists) {
      await connection.execute(
        `INSERT INTO playlists (name, status, resolution, url, transition, slides, created_by_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [playlist.name, playlist.status, playlist.resolution, playlist.url, playlist.transition, playlist.slides, 1]
      );
      console.log(`  ✓ 创建播放列表: ${playlist.name}`);
    }

    // 8. 创建IP白名单
    console.log('\n🔒 创建IP白名单...');

    const ipWhitelist = [
      { ip: '192.168.1.100', type: 'single', description: '办公室网络', addedBy: 'admin', enabled: true },
      { ip: '10.0.0.0/8', type: 'range', description: '内网IP段', addedBy: 'admin', enabled: true },
      { ip: '203.0.113.0/24', type: 'range', description: '合作伙伴网络', addedBy: 'admin', enabled: true },
      { ip: '198.51.100.50', type: 'single', description: '测试服务器', addedBy: 'admin', enabled: false }
    ];

    for (const ip of ipWhitelist) {
      await connection.execute(
        `INSERT INTO ip_whitelist (ip, type, description, addedBy, enabled, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [ip.ip, ip.type, ip.description, ip.addedBy, ip.enabled]
      );
      console.log(`  ✓ 创建IP白名单: ${ip.ip}`);
    }

    // 9. 创建备份记录
    console.log('\n💾 创建备份记录...');

    const backups = [
      {
        fileName: 'backup_2024_01_15.sql.gz',
        version: 'v1.0.0',
        type: 'auto',
        size: 15728640,
        note: '自动备份 - 每日定时任务',
        filePath: '/backups/backup_2024_01_15.sql.gz',
        metadata: JSON.stringify({
          tables: 12,
          rows: 15420,
          duration: 45
        }),
        status: 'completed'
      },
      {
        fileName: 'backup_2024_01_14.sql.gz',
        version: 'v1.0.0',
        type: 'auto',
        size: 15234567,
        note: '自动备份 - 每日定时任务',
        filePath: '/backups/backup_2024_01_14.sql.gz',
        metadata: JSON.stringify({
          tables: 12,
          rows: 15200,
          duration: 43
        }),
        status: 'completed'
      },
      {
        fileName: 'backup_2024_01_13_manual.sql.gz',
        version: 'v1.0.0',
        type: 'manual',
        size: 15123456,
        note: '手动备份 - 系统升级前',
        filePath: '/backups/backup_2024_01_13_manual.sql.gz',
        metadata: JSON.stringify({
          tables: 12,
          rows: 15000,
          duration: 42
        }),
        status: 'completed'
      }
    ];

    for (const backup of backups) {
      await connection.execute(
        `INSERT INTO backups (fileName, version, type, size, note, filePath, metadata, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [backup.fileName, backup.version, backup.type, backup.size, backup.note, backup.filePath, backup.metadata, backup.status]
      );
      console.log(`  ✓ 创建备份记录: ${backup.fileName}`);
    }

    console.log('\n✅ Mock 数据填充完成！\n');
    console.log('📊 数据统计:');
    console.log(`   用户: 5 个 (1个管理员 + 4个测试用户)`);
    console.log(`   数据连接: ${connections.length} 个`);
    console.log(`   数据集: ${datasets.length} 个`);
    console.log(`   模板: ${templates.length} 个`);
    console.log(`   项目: ${projects.length} 个`);
    console.log(`   媒体文件: ${mediaFiles.length} 个`);
    console.log(`   播放列表: ${playlists.length} 个`);
    console.log(`   IP白名单: ${ipWhitelist.length} 个`);
    console.log(`   备份记录: ${backups.length} 个\n`);

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
  seedMockData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedMockData };

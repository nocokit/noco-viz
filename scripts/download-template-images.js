const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 模板数据
const templates = [
  {
    id: 'tpl-official-001',
    name: '集团经营驾驶舱',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    filename: 'template-business-dashboard.jpg'
  },
  {
    id: 'tpl-official-002',
    name: '数字化工厂监控',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop',
    filename: 'template-factory-monitoring.jpg'
  },
  {
    id: 'tpl-official-003',
    name: '网络安全态势感知',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    filename: 'template-security-monitoring.jpg'
  },
  {
    id: 'tpl-official-004',
    name: '供应链全景监控',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=450&fit=crop',
    filename: 'template-supply-chain.jpg'
  },
  {
    id: 'tpl-official-005',
    name: '人力资源数据看板',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
    filename: 'template-hr-dashboard.jpg'
  },
  {
    id: 'tpl-official-006',
    name: '客户服务质量分析',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    filename: 'template-customer-service.jpg'
  },
  {
    id: 'tpl-shared-001',
    name: '华东区销售周报',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop',
    filename: 'template-sales-weekly.jpg'
  },
  {
    id: 'tpl-shared-002',
    name: '极简风数据图表',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&sat=-100',
    filename: 'template-minimal-charts.jpg'
  },
  {
    id: 'tpl-shared-003',
    name: '研发效能看板',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    filename: 'template-dev-efficiency.jpg'
  },
  {
    id: 'tpl-shared-004',
    name: '营销活动实时监控',
    url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=450&fit=crop',
    filename: 'template-marketing-monitor.jpg'
  },
  {
    id: 'tpl-shared-005',
    name: '财务月度汇总',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop',
    filename: 'template-finance-monthly.jpg'
  }
];

// 确保目录存在
const uploadsDir = path.join(__dirname, '../backend-node/uploads/templates');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 下载单个文件
function downloadFile(url, filepath, templateName) {
  return new Promise((resolve, reject) => {
    console.log(`正在下载: ${templateName}...`);

    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        downloadFile(response.headers.location, filepath, templateName)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`下载失败: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ 已下载: ${templateName} -> ${path.basename(filepath)}`);
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 下载所有图片
async function downloadAllImages() {
  console.log('开始下载模板缩略图...\n');

  const results = [];

  for (const template of templates) {
    try {
      const filepath = path.join(uploadsDir, template.filename);
      await downloadFile(template.url, filepath, template.name);
      results.push({
        id: template.id,
        name: template.name,
        filename: template.filename,
        path: `/uploads/templates/${template.filename}`,
        success: true
      });

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ 下载失败: ${template.name} - ${error.message}`);
      results.push({
        id: template.id,
        name: template.name,
        success: false,
        error: error.message
      });
    }
  }

  // 生成映射文件
  const mapping = results.filter(r => r.success).reduce((acc, item) => {
    acc[item.id] = item.path;
    return acc;
  }, {});

  const mappingPath = path.join(__dirname, '../frontend/src/config/template-images.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

  console.log('\n下载完成!');
  console.log(`成功: ${results.filter(r => r.success).length}/${results.length}`);
  console.log(`映射文件已生成: ${mappingPath}`);
}

downloadAllImages().catch(console.error);

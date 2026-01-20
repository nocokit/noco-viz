/**
 * 批量更新媒体文件名称为中文
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

// 文件名到中文名称的映射
const nameMapping = {
  'template-business-dashboard.jpg': '商业仪表盘',
  'template-factory-monitoring.jpg': '工厂监控',
  'template-security-monitoring.jpg': '安全监控',
  'template-supply-chain.jpg': '供应链监控',
  'template-hr-dashboard.jpg': '人力资源看板',
  'template-customer-service.jpg': '客户服务分析',
  'template-sales-weekly.jpg': '销售周报',
  'template-minimal-charts.jpg': '极简数据图表',
  'template-dev-efficiency.jpg': '研发效能看板',
  'template-marketing-monitor.jpg': '营销活动监控',
  'template-finance-monthly.jpg': '财务月度汇总',
};

async function login() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123',
    });
    return response.data.access_token;
  } catch (error) {
    console.error('登录失败:', error.message);
    throw error;
  }
}

async function getMediaList(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/media`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('获取媒体列表失败:', error.message);
    throw error;
  }
}

async function updateMedia(token, id, data) {
  try {
    await axios.patch(`${API_BASE_URL}/media/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.error(`更新媒体 ${id} 失败:`, error.message);
    return false;
  }
}

async function main() {
  console.log('开始更新媒体文件名称...\n');

  // 1. 登录获取token
  console.log('正在登录...');
  const token = await login();
  console.log('✓ 登录成功\n');

  // 2. 获取媒体列表
  console.log('正在获取媒体列表...');
  const mediaList = await getMediaList(token);
  console.log(`✓ 找到 ${mediaList.length} 个媒体文件\n`);

  // 3. 批量更新名称
  console.log('开始批量更新名称:\n');
  let successCount = 0;
  let skipCount = 0;

  for (const media of mediaList) {
    const chineseName = nameMapping[media.name];

    if (chineseName) {
      console.log(`更新: ${media.name} -> ${chineseName}`);
      const success = await updateMedia(token, media.id, {
        name: chineseName,
      });

      if (success) {
        successCount++;
        console.log(`  ✓ 更新成功 (ID: ${media.id})`);
      } else {
        console.log(`  ✗ 更新失败 (ID: ${media.id})`);
      }
    } else {
      console.log(`跳过: ${media.name} (未找到对应的中文名称)`);
      skipCount++;
    }
    console.log('');
  }

  // 4. 输出统计
  console.log('=====================================');
  console.log('更新完成!');
  console.log(`成功: ${successCount} 个`);
  console.log(`跳过: ${skipCount} 个`);
  console.log(`总计: ${mediaList.length} 个`);
  console.log('=====================================');
}

main().catch((error) => {
  console.error('执行失败:', error);
  process.exit(1);
});

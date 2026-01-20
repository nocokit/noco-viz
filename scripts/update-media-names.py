#!/usr/bin/env python3
"""
批量更新媒体文件名称为中文
"""

import requests
import json

API_BASE_URL = 'http://localhost:8000/api'

# 文件名到中文名称的映射
NAME_MAPPING = {
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
}

def login():
    """登录获取token"""
    try:
        response = requests.post(
            f'{API_BASE_URL}/auth/login',
            json={'username': 'admin', 'password': 'admin123'}
        )
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        print(f'✗ 登录失败: {e}')
        raise

def get_media_list(token):
    """获取媒体列表"""
    try:
        response = requests.get(
            f'{API_BASE_URL}/media',
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        return response.json()['data']
    except Exception as e:
        print(f'✗ 获取媒体列表失败: {e}')
        raise

def update_media(token, media_id, name):
    """更新媒体名称"""
    try:
        response = requests.patch(
            f'{API_BASE_URL}/media/{media_id}',
            json={'name': name},
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        return True
    except Exception as e:
        print(f'  ✗ 更新失败: {e}')
        return False

def main():
    print('开始更新媒体文件名称...\n')

    # 1. 登录
    print('正在登录...')
    token = login()
    print('✓ 登录成功\n')

    # 2. 获取媒体列表
    print('正在获取媒体列表...')
    media_list = get_media_list(token)
    print(f'✓ 找到 {len(media_list)} 个媒体文件\n')

    # 3. 批量更新
    print('开始批量更新名称:\n')
    success_count = 0
    skip_count = 0

    for media in media_list:
        old_name = media['name']
        chinese_name = NAME_MAPPING.get(old_name)

        if chinese_name:
            print(f'更新: {old_name} -> {chinese_name}')
            if update_media(token, media['id'], chinese_name):
                print(f'  ✓ 更新成功 (ID: {media["id"]})')
                success_count += 1
            else:
                print(f'  ✗ 更新失败 (ID: {media["id"]})')
        else:
            print(f'跳过: {old_name} (未找到对应的中文名称)')
            skip_count += 1
        print()

    # 4. 输出统计
    print('=' * 50)
    print('更新完成!')
    print(f'成功: {success_count} 个')
    print(f'跳过: {skip_count} 个')
    print(f'总计: {len(media_list)} 个')
    print('=' * 50)

if __name__ == '__main__':
    main()

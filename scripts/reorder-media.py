#!/usr/bin/env python3
"""
调整媒体文件顺序 - 将客户服务分析和销售周报放到前2位
"""

import requests
from datetime import datetime, timedelta

API_BASE_URL = 'http://localhost:8000/api'

def login():
    """登录获取token"""
    response = requests.post(
        f'{API_BASE_URL}/auth/login',
        json={'username': 'admin', 'password': 'admin123'}
    )
    response.raise_for_status()
    return response.json()['access_token']

def get_media_list(token):
    """获取媒体列表"""
    response = requests.get(
        f'{API_BASE_URL}/media',
        headers={'Authorization': f'Bearer {token}'}
    )
    response.raise_for_status()
    return response.json()['data']

def update_media_order(token):
    """通过更新createdAt时间来调整顺序"""
    media_list = get_media_list(token)

    # 找到需要调整的两个文件
    customer_service = None
    sales_weekly = None

    for media in media_list:
        if media['name'] == '客户服务分析':
            customer_service = media
        elif media['name'] == '销售周报':
            sales_weekly = media

    if not customer_service or not sales_weekly:
        print('✗ 未找到目标文件')
        return

    print(f'找到文件:')
    print(f'  客户服务分析 (ID: {customer_service["id"]})')
    print(f'  销售周报 (ID: {sales_weekly["id"]})')
    print()

    # 获取当前最新的创建时间
    latest_time = max([datetime.fromisoformat(m['createdAt'].replace('Z', '+00:00')) for m in media_list])

    # 设置新的创建时间（比最新的还要新，确保排在最前面）
    # 销售周报放第1位
    sales_time = latest_time + timedelta(seconds=2)
    # 客户服务分析放第2位
    customer_time = latest_time + timedelta(seconds=1)

    print('开始调整顺序...\n')

    # 注意：由于后端可能不支持直接更新createdAt，我们需要通过其他方式
    # 这里我们将通过删除并重新创建的方式来调整顺序
    # 但为了保持简单，我们直接在MySQL中更新

    print('需要直接在数据库中调整顺序')
    print('执行以下SQL命令:\n')

    print(f"UPDATE media SET created_at = '{sales_time.strftime('%Y-%m-%d %H:%M:%S')}' WHERE id = {sales_weekly['id']};")
    print(f"UPDATE media SET created_at = '{customer_time.strftime('%Y-%m-%d %H:%M:%S')}' WHERE id = {customer_service['id']};")

def main():
    print('开始调整媒体文件顺序...\n')

    print('正在登录...')
    token = login()
    print('✓ 登录成功\n')

    update_media_order(token)

if __name__ == '__main__':
    main()

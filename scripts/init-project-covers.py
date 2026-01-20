#!/usr/bin/env python3
"""
为现有项目从媒体资源库初始化封面
"""

import requests

API_BASE_URL = 'http://localhost:8000/api'

# 项目名称到媒体名称的映射
PROJECT_COVER_MAPPING = {
    '2024年度销售分析': '销售周报',
    '用户增长报告': '营销活动监控',
    '仓库库存监控': '供应链监控',
    '网站运营数据': '商业仪表盘',
}

def login():
    """登录获取token"""
    response = requests.post(
        f'{API_BASE_URL}/auth/login',
        json={'username': 'admin', 'password': 'admin123'}
    )
    response.raise_for_status()
    return response.json()['access_token']

def get_projects(token):
    """获取项目列表"""
    response = requests.get(
        f'{API_BASE_URL}/projects',
        headers={'Authorization': f'Bearer {token}'}
    )
    response.raise_for_status()
    return response.json()

def get_media_list(token):
    """获取媒体列表"""
    response = requests.get(
        f'{API_BASE_URL}/media',
        headers={'Authorization': f'Bearer {token}'}
    )
    response.raise_for_status()
    return response.json()['data']

def update_project(token, project_id, data):
    """更新项目"""
    try:
        response = requests.patch(
            f'{API_BASE_URL}/projects/{project_id}',
            json=data,
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        return True
    except Exception as e:
        print(f'  ✗ 更新失败: {e}')
        return False

def main():
    print('开始为现有项目初始化封面...\n')

    # 1. 登录
    print('正在登录...')
    token = login()
    print('✓ 登录成功\n')

    # 2. 获取项目列表
    print('正在获取项目列表...')
    projects = get_projects(token)
    print(f'✓ 找到 {len(projects)} 个项目\n')

    # 3. 获取媒体列表
    print('正在获取媒体列表...')
    media_list = get_media_list(token)
    print(f'✓ 找到 {len(media_list)} 个媒体文件\n')

    # 创建媒体名称到URL的映射
    media_map = {media['name']: media['url'] for media in media_list}

    # 4. 更新项目封面
    print('开始更新项目封面:\n')
    success_count = 0
    skip_count = 0

    for project in projects:
        project_title = project['title']
        media_name = PROJECT_COVER_MAPPING.get(project_title)

        if media_name and media_name in media_map:
            cover_url = media_map[media_name]
            print(f'更新项目: {project_title}')
            print(f'  封面: {media_name} ({cover_url})')

            if update_project(token, project['id'], {'coverImage': cover_url}):
                print(f'  ✓ 更新成功 (ID: {project["id"]})')
                success_count += 1
            else:
                print(f'  ✗ 更新失败 (ID: {project["id"]})')
        else:
            print(f'跳过项目: {project_title} (未找到对应的封面)')
            skip_count += 1
        print()

    # 5. 输出统计
    print('=' * 50)
    print('更新完成!')
    print(f'成功: {success_count} 个')
    print(f'跳过: {skip_count} 个')
    print(f'总计: {len(projects)} 个')
    print('=' * 50)

if __name__ == '__main__':
    main()

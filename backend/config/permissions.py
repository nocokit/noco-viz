"""
权限配置文件
定义系统所有权限
"""

PERMISSIONS_CONFIG = {
    'project': {
        'label': '项目管理',
        'permissions': {
            'view': '查看项目',
            'create': '创建项目',
            'edit': '编辑项目',
            'delete': '删除项目',
            'publish': '发布项目',
        }
    },
    'dataset': {
        'label': '数据集管理',
        'permissions': {
            'view': '查看数据集',
            'create': '创建数据集',
            'edit': '编辑数据集',
            'delete': '删除数据集',
            'preview': '预览数据',
        }
    },
    'connection': {
        'label': '数据库连接',
        'permissions': {
            'view': '查看连接',
            'create': '创建连接',
            'edit': '编辑连接',
            'delete': '删除连接',
            'test': '测试连接',
        }
    },
    'role': {
        'label': '角色管理',
        'permissions': {
            'view': '查看角色',
            'create': '创建角色',
            'edit': '编辑角色',
            'delete': '删除角色',
        }
    },
    'user': {
        'label': '用户管理',
        'permissions': {
            'view': '查看用户',
            'create': '创建用户',
            'edit': '编辑用户',
            'delete': '删除用户',
            'assign_role': '分配角色',
        }
    },
    'system': {
        'label': '系统设置',
        'permissions': {
            'view': '查看设置',
            'edit': '修改设置',
            'backup': '备份数据',
            'restore': '恢复数据',
        }
    },
}


def get_permissions_tree():
    """
    获取权限树结构
    """
    tree = []
    for key, config in PERMISSIONS_CONFIG.items():
        children = [
            {
                'id': f"{key}:{perm_key}",
                'label': perm_label
            }
            for perm_key, perm_label in config['permissions'].items()
        ]

        tree.append({
            'id': key,
            'label': config['label'],
            'children': children
        })

    return tree


def check_permission(user, permission_code):
    """
    检查用户是否有指定权限

    Args:
        user: 用户对象
        permission_code: 权限代码，如 'project:create'

    Returns:
        bool: 是否有权限
    """
    # 超级管理员拥有所有权限
    if user.is_superuser:
        return True

    # 检查用户角色权限
    if hasattr(user, 'role') and user.role:
        return permission_code in user.role.permissions

    return False

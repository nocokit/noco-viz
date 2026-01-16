# 后端接口代码审查报告

**审查日期**: 2026-01-15
**审查人**: Claude Code
**项目**: NoCo-Viz 数据可视化平台
**版本**: v1.0

---

## 📊 审查概览

### 审查范围
- ✅ 项目管理模块 (apps/projects)
- ✅ 角色权限模块 (apps/roles)
- ✅ 数据集管理模块 (apps/datasets)
- ✅ 用户认证模块 (apps/users)
- ✅ 配置文件和安全性

### 总体评分
| 维度 | 评分 | 说明 |
|------|------|------|
| 代码质量 | ⭐⭐⭐⭐☆ | 4/5 - 结构清晰，符合规范 |
| 安全性 | ⭐⭐⭐☆☆ | 3/5 - 存在安全隐患需修复 |
| 性能 | ⭐⭐⭐⭐☆ | 4/5 - 基本优化到位 |
| 可维护性 | ⭐⭐⭐⭐☆ | 4/5 - 代码组织良好 |
| 文档完整性 | ⭐⭐⭐⭐☆ | 4/5 - 注释清晰 |

---

## ✅ 优点

### 1. 代码结构
- ✅ **模块化设计**: 各模块职责清晰，符合 Django 最佳实践
- ✅ **RESTful 规范**: API 设计遵循 RESTful 风格
- ✅ **序列化器分离**: 列表和详情使用不同序列化器，优化性能
- ✅ **统一响应格式**: 使用自定义 Renderer 统一 API 响应

### 2. 数据库设计
- ✅ **索引优化**: 关键字段添加了数据库索引
- ✅ **外键关联**: 正确使用 ForeignKey 和 related_name
- ✅ **字段约束**: 合理使用 unique、blank、null 等约束
- ✅ **时间戳**: 统一使用 created_at 和 updated_at

### 3. 功能实现
- ✅ **JWT 认证**: 使用 simplejwt 实现 Token 认证
- ✅ **权限控制**: 使用 IsAuthenticated 保护接口
- ✅ **过滤排序**: 集成 django-filters 支持复杂查询
- ✅ **API 文档**: 集成 drf-spectacular 自动生成文档

---

## ⚠️ 问题与建议

### 🔴 严重问题 (必须修复)

#### 1. **密码明文存储** - Connection 模型
**位置**: `apps/datasets/models.py:75`

```python
# ❌ 问题代码
password = models.CharField('密码', max_length=200)  # 实际应该加密存储
```

**风险**: 数据库连接密码以明文存储，存在严重安全隐患

**建议修复**:
```python
from django.conf import settings
from cryptography.fernet import Fernet

class Connection(models.Model):
    password = models.CharField('密码', max_length=500)  # 加密后长度增加

    def set_password(self, raw_password):
        """加密存储密码"""
        cipher = Fernet(settings.DB_PASSWORD_KEY.encode())
        self.password = cipher.encrypt(raw_password.encode()).decode()

    def get_password(self):
        """解密获取密码"""
        cipher = Fernet(settings.DB_PASSWORD_KEY.encode())
        return cipher.decrypt(self.password.encode()).decode()
```

---

#### 2. **缺少权限验证** - 项目删除
**位置**: `apps/projects/views.py:18-36`

```python
# ❌ 问题代码
def get_queryset(self):
    queryset = super().get_queryset()
    # 这里暂时返回所有项目，后续可以根据角色权限过滤
    return queryset
```

**风险**: 用户可以查看和操作所有项目，包括其他用户的项目

**建议修复**:
```python
def get_queryset(self):
    """只返回用户有权限的项目"""
    user = self.request.user
    queryset = super().get_queryset()

    # 超级管理员可以看到所有项目
    if user.is_superuser:
        return queryset

    # 根据角色权限过滤
    if user.role and user.role.scope == 'all':
        return queryset
    elif user.role and user.role.scope == 'dept':
        # TODO: 实现部门过滤逻辑
        return queryset.filter(created_by__department=user.department)
    else:
        # 默认只能看到自己创建的
        return queryset.filter(created_by=user)

def perform_destroy(self, instance):
    """删除前检查权限"""
    if instance.created_by != self.request.user and not self.request.user.is_superuser:
        raise PermissionDenied('您没有权限删除此项目')
    instance.delete()
```

---

#### 3. **SQL 注入风险** - 数据集预览
**位置**: `apps/datasets/views.py:32-57`

```python
# ⚠️ 潜在风险
@action(detail=True, methods=['get'])
def preview(self, request, pk=None):
    dataset = self.get_object()
    # 这里应该根据数据集类型读取实际数据
    # 如果直接执行 SQL，需要防止注入
```

**建议**: 实现真实数据预览时，必须使用参数化查询
```python
from django.db import connection

def preview_sql_dataset(self, dataset):
    """安全的 SQL 查询"""
    with connection.cursor() as cursor:
        # ✅ 使用参数化查询
        cursor.execute(
            "SELECT * FROM %s LIMIT %s",
            [dataset.config['table_name'], 100]
        )
        # 或使用 ORM
```

---

### 🟡 中等问题 (建议修复)

#### 4. **缺少数据验证** - 角色复制
**位置**: `apps/roles/views.py:42-62`

```python
# ⚠️ 缺少验证
new_name = request.data.get('name', f"{role.name}（副本）")
new_role = Role.objects.create(name=new_name, ...)
```

**问题**: 没有验证新名称是否已存在，可能导致数据库唯一约束错误

**建议修复**:
```python
@action(detail=True, methods=['post'])
def clone(self, request, pk=None):
    role = self.get_object()
    new_name = request.data.get('name', f"{role.name}（副本）")

    # ✅ 验证名称唯一性
    if Role.objects.filter(name=new_name).exists():
        return Response(
            {'detail': f'角色名称 "{new_name}" 已存在'},
            status=status.HTTP_400_BAD_REQUEST
        )

    new_role = Role.objects.create(
        name=new_name,
        description=role.description,
        is_system=False,
        scope=role.scope,
        permissions=role.permissions.copy()  # 深拷贝
    )

    serializer = self.get_serializer(new_role)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
```

---

#### 5. **N+1 查询问题** - 用户关联
**位置**: `apps/projects/serializers.py:8`

```python
# ⚠️ 可能产生 N+1 查询
created_by_name = serializers.CharField(source='created_by.username', read_only=True)
```

**建议**: 在 ViewSet 中使用 select_related 优化
```python
class ProjectViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = super().get_queryset()
        # ✅ 预加载关联对象
        return queryset.select_related('created_by')
```

---

#### 6. **缺少事务保护** - 项目复制
**位置**: `apps/projects/views.py:38-59`

```python
# ⚠️ 缺少事务
new_project = Project.objects.create(...)
```

**建议**: 使用事务确保数据一致性
```python
from django.db import transaction

@action(detail=True, methods=['post'])
@transaction.atomic
def duplicate(self, request, pk=None):
    project = self.get_object()

    try:
        new_project = Project.objects.create(
            title=f"{project.title} (副本)",
            type=project.type,
            description=project.description,
            cover_image=project.cover_image,
            status='draft',
            config=project.config.copy(),  # 深拷贝
            created_by=request.user
        )

        serializer = self.get_serializer(new_project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(
            {'detail': f'复制失败: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

---

#### 7. **缺少分页限制** - 列表接口
**位置**: 所有 ViewSet

**问题**: 虽然配置了分页器，但没有限制最大页面大小

**建议**: 在 settings.py 中配置
```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'utils.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 20,
    'MAX_PAGE_SIZE': 100,  # ✅ 添加最大限制
}
```

---

#### 8. **缺少日志记录** - 关键操作
**位置**: 所有 ViewSet

**建议**: 添加操作日志
```python
import logging

logger = logging.getLogger(__name__)

class ProjectViewSet(viewsets.ModelViewSet):
    def perform_create(self, serializer):
        instance = serializer.save()
        logger.info(
            f"User {self.request.user.id} created project {instance.id}",
            extra={'user_id': self.request.user.id, 'project_id': instance.id}
        )

    def perform_destroy(self, instance):
        logger.warning(
            f"User {self.request.user.id} deleted project {instance.id}",
            extra={'user_id': self.request.user.id, 'project_id': instance.id}
        )
        instance.delete()
```

---

### 🟢 轻微问题 (可选优化)

#### 9. **硬编码权限树** - 角色管理
**位置**: `apps/roles/views.py:64-104`

```python
# ⚠️ 硬编码
permissions_tree = [
    {'id': 'project', 'label': '项目管理', ...}
]
```

**建议**: 从配置文件或数据库读取
```python
# config/permissions.py
PERMISSIONS_CONFIG = {
    'project': {
        'label': '项目管理',
        'permissions': ['view', 'create', 'edit', 'delete']
    },
    ...
}

# views.py
from config.permissions import PERMISSIONS_CONFIG

@action(detail=False, methods=['get'])
def permissions_tree(self, request):
    tree = []
    for key, config in PERMISSIONS_CONFIG.items():
        tree.append({
            'id': key,
            'label': config['label'],
            'children': [
                {'id': f"{key}:{perm}", 'label': f"{label}"}
                for perm, label in config['permissions'].items()
            ]
        })
    return Response(tree)
```

---

#### 10. **缺少字段验证** - 项目配置
**位置**: `apps/projects/models.py:23`

```python
config = models.JSONField('配置信息', default=dict, blank=True)
```

**建议**: 添加 JSON Schema 验证
```python
from django.core.validators import validate_json_schema

PROJECT_CONFIG_SCHEMA = {
    "type": "object",
    "properties": {
        "canvas": {"type": "object"},
        "components": {"type": "array"}
    }
}

class Project(models.Model):
    config = models.JSONField(
        '配置信息',
        default=dict,
        blank=True,
        validators=[validate_json_schema(PROJECT_CONFIG_SCHEMA)]
    )
```

---

#### 11. **缺少软删除** - 数据安全
**位置**: 所有模型

**建议**: 实现软删除机制
```python
class SoftDeleteModel(models.Model):
    """软删除基类"""
    is_deleted = models.BooleanField('是否删除', default=False)
    deleted_at = models.DateTimeField('删除时间', null=True, blank=True)

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        """软删除"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self):
        """真实删除"""
        super().delete()

class Project(SoftDeleteModel):
    ...
```

---

#### 12. **缺少 API 版本控制**
**位置**: `config/urls.py`

**建议**: 添加版本控制
```python
urlpatterns = [
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/projects/', include('apps.projects.urls')),
    path('api/v1/roles/', include('apps.roles.urls')),
    path('api/v1/', include('apps.datasets.urls')),
]
```

---

## 🔒 安全性检查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| SQL 注入防护 | ⚠️ | 使用 ORM，但需注意原始 SQL |
| XSS 防护 | ✅ | DRF 自动转义 |
| CSRF 防护 | ✅ | 已启用 CSRF 中间件 |
| 密码加密 | ❌ | Connection 密码明文存储 |
| JWT Token | ✅ | 使用 simplejwt |
| 权限控制 | ⚠️ | 基础权限已实现，需细化 |
| 输入验证 | ⚠️ | 部分缺失 |
| 日志审计 | ❌ | 未实现 |
| 速率限制 | ❌ | 未配置 |
| CORS 配置 | ⚠️ | 需检查生产环境配置 |

---

## 📈 性能优化建议

### 1. 数据库查询优化
```python
# ✅ 使用 select_related 和 prefetch_related
queryset = Project.objects.select_related('created_by').prefetch_related('datasets')

# ✅ 使用 only() 和 defer() 减少字段查询
queryset = Project.objects.only('id', 'title', 'type')

# ✅ 使用 annotate 减少查询次数
from django.db.models import Count
queryset = Role.objects.annotate(user_count=Count('users'))
```

### 2. 缓存策略
```python
from django.core.cache import cache

class RoleViewSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['get'])
    def permissions_tree(self, request):
        cache_key = 'permissions_tree'
        tree = cache.get(cache_key)

        if tree is None:
            tree = self._build_permissions_tree()
            cache.set(cache_key, tree, 3600)  # 缓存1小时

        return Response(tree)
```

### 3. 异步任务
```python
# 对于耗时操作，使用 Celery
from celery import shared_task

@shared_task
def process_large_dataset(dataset_id):
    """异步处理大数据集"""
    dataset = Dataset.objects.get(id=dataset_id)
    # 处理逻辑...
```

---

## 🧪 测试建议

### 1. 单元测试
```python
# tests/test_projects.py
from django.test import TestCase
from apps.projects.models import Project

class ProjectModelTest(TestCase):
    def test_create_project(self):
        project = Project.objects.create(
            title='测试项目',
            type='screen',
            created_by=self.user
        )
        self.assertEqual(project.status, 'draft')
```

### 2. API 测试
```python
from rest_framework.test import APITestCase

class ProjectAPITest(APITestCase):
    def test_list_projects(self):
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, 200)
```

### 3. 集成测试
- 测试完整的用户注册登录流程
- 测试项目创建到发布的完整流程
- 测试权限控制是否生效

---

## 📋 待办事项优先级

### P0 - 立即修复
- [ ] 加密存储数据库连接密码
- [ ] 实现项目权限控制
- [ ] 添加 SQL 注入防护

### P1 - 本周完成
- [ ] 添加数据验证
- [ ] 实现操作日志
- [ ] 配置速率限制
- [ ] 优化 N+1 查询

### P2 - 下周完成
- [ ] 实现软删除
- [ ] 添加缓存策略
- [ ] 完善单元测试
- [ ] API 版本控制

### P3 - 后续优化
- [ ] 权限树配置化
- [ ] JSON Schema 验证
- [ ] 异步任务处理
- [ ] 性能监控

---

## 📚 推荐资源

### Django 最佳实践
- [Django Security Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [DRF Best Practices](https://www.django-rest-framework.org/topics/best-practices/)
- [Two Scoops of Django](https://www.feldroy.com/books/two-scoops-of-django-3-x)

### 安全加固
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/4.2/topics/security/)

---

## 📊 总结

### 整体评价
代码质量整体良好，架构清晰，符合 Django 和 DRF 的最佳实践。主要问题集中在**安全性**和**权限控制**方面，需要优先修复。

### 关键改进点
1. **安全性**: 加密敏感数据，完善权限控制
2. **性能**: 优化数据库查询，添加缓存
3. **可维护性**: 添加日志、测试和文档
4. **健壮性**: 增加数据验证和错误处理

### 下一步行动
1. 立即修复 P0 级别的安全问题
2. 完善权限控制和数据验证
3. 添加单元测试和集成测试
4. 优化性能和添加监控

---

**审查完成时间**: 2026-01-15
**建议复审时间**: 修复 P0/P1 问题后

**签名**: Claude Code
**版本**: v1.0

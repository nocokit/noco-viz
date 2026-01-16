from django.db import models
from django.conf import settings


class Role(models.Model):
    """角色模型"""

    SCOPE_CHOICES = [
        ('all', '全部数据'),
        ('dept', '本部门'),
        ('self', '仅本人'),
        ('custom', '自定义'),
    ]

    name = models.CharField('角色名称', max_length=100, unique=True)
    description = models.TextField('角色描述', blank=True, default='')
    is_system = models.BooleanField('是否系统内置', default=False)
    scope = models.CharField('数据权限范围', max_length=20, choices=SCOPE_CHOICES, default='self')
    permissions = models.JSONField('权限列表', default=list, blank=True)

    # 时间戳
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'roles'
        verbose_name = '角色'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_system']),
        ]

    def __str__(self):
        return self.name

    @property
    def user_count(self):
        """关联用户数"""
        return self.user_set.count()

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    自定义用户模型
    """
    # 基本信息
    phone = models.CharField(
        '手机号',
        max_length=11,
        unique=True,
        db_index=True,
        null=True,
        blank=True,
        help_text='用于登录'
    )
    avatar = models.ImageField(
        '头像',
        upload_to='avatars/',
        null=True,
        blank=True
    )

    # 状态
    is_active = models.BooleanField('是否激活', default=True)

    # 时间戳
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'users'
        verbose_name = '用户'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.username

from django.db import models
from django.conf import settings
import base64


class Dataset(models.Model):
    """数据集模型"""

    TYPE_CHOICES = [
        ('excel', 'Excel文件'),
        ('sql', 'SQL查询'),
        ('api', 'API接口'),
    ]

    STATUS_CHOICES = [
        ('active', '激活'),
        ('inactive', '未激活'),
    ]

    name = models.CharField('数据集名称', max_length=200)
    type = models.CharField('数据源类型', max_length=20, choices=TYPE_CHOICES)
    config = models.JSONField('配置信息', default=dict, blank=True)
    fields = models.JSONField('字段列表', default=list, blank=True)
    row_count = models.IntegerField('数据行数', default=0)
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='active')

    # 关联字段
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='datasets',
        verbose_name='创建人'
    )

    # 时间戳
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'datasets'
        verbose_name = '数据集'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type']),
            models.Index(fields=['status']),
            models.Index(fields=['created_by']),
        ]

    def __str__(self):
        return self.name


class Connection(models.Model):
    """数据库连接模型"""

    TYPE_CHOICES = [
        ('mysql', 'MySQL'),
        ('postgresql', 'PostgreSQL'),
        ('oracle', 'Oracle'),
        ('sqlserver', 'SQL Server'),
    ]

    STATUS_CHOICES = [
        ('connected', '已连接'),
        ('disconnected', '未连接'),
        ('error', '错误'),
    ]

    name = models.CharField('连接名称', max_length=200)
    type = models.CharField('数据库类型', max_length=20, choices=TYPE_CHOICES)
    host = models.CharField('主机地址', max_length=200)
    port = models.IntegerField('端口')
    database = models.CharField('数据库名', max_length=200)
    username = models.CharField('用户名', max_length=200)
    password = models.CharField('密码（加密）', max_length=500)  # 加密存储
    status = models.CharField('连接状态', max_length=20, choices=STATUS_CHOICES, default='disconnected')
    last_test_time = models.DateTimeField('最后测试时间', null=True, blank=True)

    def set_password(self, raw_password):
        """加密存储密码"""
        from cryptography.fernet import Fernet
        from django.conf import settings

        # 使用 Fernet 对称加密
        key = settings.SECRET_KEY[:32].encode().ljust(32, b'0')
        cipher = Fernet(base64.urlsafe_b64encode(key))
        self.password = cipher.encrypt(raw_password.encode()).decode()

    def get_password(self):
        """解密获取密码"""
        from cryptography.fernet import Fernet
        from django.conf import settings
        import base64

        try:
            key = settings.SECRET_KEY[:32].encode().ljust(32, b'0')
            cipher = Fernet(base64.urlsafe_b64encode(key))
            return cipher.decrypt(self.password.encode()).decode()
        except Exception:
            return None

    # 关联字段
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='connections',
        verbose_name='创建人'
    )

    # 时间戳
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'connections'
        verbose_name = '数据库连接'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return self.name

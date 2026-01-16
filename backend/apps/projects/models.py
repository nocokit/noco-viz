from django.db import models
from django.conf import settings


class Project(models.Model):
    """项目模型"""

    TYPE_CHOICES = [
        ('screen', '数据可视化大屏'),
        ('report', '中国式复杂报表'),
    ]

    STATUS_CHOICES = [
        ('draft', '草稿'),
        ('published', '已发布'),
    ]

    title = models.CharField('项目名称', max_length=200)
    type = models.CharField('项目类型', max_length=20, choices=TYPE_CHOICES)
    description = models.TextField('项目描述', blank=True, default='')
    cover_image = models.URLField('封面图片', max_length=500, blank=True, null=True)
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='draft')
    config = models.JSONField('配置信息', default=dict, blank=True)

    # 关联字段
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects',
        verbose_name='创建人'
    )

    # 时间戳
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'projects'
        verbose_name = '项目'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type']),
            models.Index(fields=['status']),
            models.Index(fields=['created_by']),
        ]

    def __str__(self):
        return self.title

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.projects.models import Project
from apps.projects.serializers import ProjectSerializer, ProjectListSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """
    项目管理ViewSet

    提供项目的增删改查功能
    """
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'created_by']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        """根据用户权限返回项目列表"""
        user = self.request.user
        queryset = super().get_queryset().select_related('created_by')

        # 超级管理员可以看到所有项目
        if user.is_superuser:
            return queryset

        # 根据角色权限过滤
        if hasattr(user, 'role') and user.role:
            if user.role.scope == 'all':
                return queryset
            elif user.role.scope == 'dept':
                # TODO: 实现部门过滤逻辑（需要添加部门字段）
                return queryset.filter(created_by=user)
            else:
                # 默认只能看到自己创建的
                return queryset.filter(created_by=user)
        else:
            # 没有角色的用户只能看到自己创建的
            return queryset.filter(created_by=user)

    def perform_destroy(self, instance):
        """删除前检查权限"""
        from rest_framework.exceptions import PermissionDenied

        user = self.request.user
        # 只有创建者或超级管理员可以删除
        if instance.created_by != user and not user.is_superuser:
            raise PermissionDenied('您没有权限删除此项目')

        instance.delete()

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """
        复制项目

        POST /api/projects/{id}/duplicate/
        """
        from django.db import transaction
        import copy

        project = self.get_object()

        try:
            with transaction.atomic():
                # 深拷贝配置
                config_copy = copy.deepcopy(project.config)

                # 创建副本
                new_project = Project.objects.create(
                    title=f"{project.title} (副本)",
                    type=project.type,
                    description=project.description,
                    cover_image=project.cover_image,
                    status='draft',
                    config=config_copy,
                    created_by=request.user
                )

                serializer = self.get_serializer(new_project)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'detail': f'复制失败: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

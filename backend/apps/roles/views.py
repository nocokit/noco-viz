from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count

from apps.roles.models import Role
from apps.roles.serializers import RoleSerializer, RoleListSerializer


class RoleViewSet(viewsets.ModelViewSet):
    """
    角色管理ViewSet

    提供角色的增删改查功能
    """
    queryset = Role.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_system', 'scope']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return RoleListSerializer
        return RoleSerializer

    def destroy(self, request, *args, **kwargs):
        """删除角色（系统内置角色不可删除）"""
        instance = self.get_object()
        if instance.is_system:
            return Response(
                {'detail': '系统内置角色不可删除'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def clone(self, request, pk=None):
        """
        复制角色

        POST /api/roles/{id}/clone/
        """
        import copy

        role = self.get_object()
        new_name = request.data.get('name', f"{role.name}（副本）")

        # 验证名称唯一性
        if Role.objects.filter(name=new_name).exists():
            return Response(
                {'detail': f'角色名称 "{new_name}" 已存在'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 创建副本（深拷贝权限列表）
        new_role = Role.objects.create(
            name=new_name,
            description=role.description,
            is_system=False,
            scope=role.scope,
            permissions=copy.deepcopy(role.permissions)
        )

        serializer = self.get_serializer(new_role)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def permissions_tree(self, request):
        """
        获取权限树

        GET /api/roles/permissions_tree/
        """
        from config.permissions import get_permissions_tree

        permissions_tree = get_permissions_tree()
        return Response(permissions_tree)

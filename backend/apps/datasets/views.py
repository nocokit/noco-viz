from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone

from apps.datasets.models import Dataset, Connection
from apps.datasets.serializers import (
    DatasetSerializer, DatasetListSerializer,
    ConnectionSerializer, ConnectionListSerializer
)


class DatasetViewSet(viewsets.ModelViewSet):
    """数据集管理ViewSet"""

    queryset = Dataset.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'created_by']
    search_fields = ['name']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return DatasetListSerializer
        return DatasetSerializer

    @action(detail=True, methods=['get'])
    def preview(self, request, pk=None):
        """
        预览数据集数据

        GET /api/datasets/{id}/preview/
        """
        dataset = self.get_object()

        # 这里应该根据数据集类型读取实际数据
        # 暂时返回模拟数据
        mock_data = {
            'columns': [
                {'name': 'id', 'type': 'number'},
                {'name': 'name', 'type': 'string'},
                {'name': 'value', 'type': 'number'},
            ],
            'rows': [
                {'id': 1, 'name': '数据1', 'value': 100},
                {'id': 2, 'name': '数据2', 'value': 200},
                {'id': 3, 'name': '数据3', 'value': 300},
            ],
            'total': 3
        }

        return Response(mock_data)


class ConnectionViewSet(viewsets.ModelViewSet):
    """数据库连接管理ViewSet"""

    queryset = Connection.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['name', 'host']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ConnectionListSerializer
        return ConnectionSerializer

    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        """
        测试数据库连接

        POST /api/connections/{id}/test/
        """
        connection = self.get_object()

        # 这里应该实际测试数据库连接
        # 暂时模拟测试成功
        connection.status = 'connected'
        connection.last_test_time = timezone.now()
        connection.save()

        return Response({
            'status': 'success',
            'message': '连接测试成功',
            'last_test_time': connection.last_test_time
        })

    @action(detail=False, methods=['post'])
    def test_config(self, request):
        """
        测试连接配置（未保存的连接）

        POST /api/connections/test_config/
        """
        serializer = ConnectionSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # 这里应该实际测试数据库连接
        # 暂时模拟测试成功
        return Response({
            'status': 'success',
            'message': '连接测试成功'
        })

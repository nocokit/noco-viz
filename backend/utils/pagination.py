"""DRF 分页器"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    """
    标准分页器

    使用方式：
        1. 全局配置（settings.py）：
           REST_FRAMEWORK = {
               'DEFAULT_PAGINATION_CLASS': 'utils.pagination.StandardResultsSetPagination',
           }

        2. ViewSet 级别配置：
           class UserViewSet(viewsets.ModelViewSet):
               pagination_class = StandardResultsSetPagination

        3. 禁用分页：
           @action(methods=['get'], detail=False)
           def export(self, request):
               self.pagination_class = None
               # ...

    请求参数：
        - page: 页码（从1开始）
        - page_size: 每页数量（默认20，最大100）

    响应格式：
        {
            "items": [...],           # 当前页数据
            "total": 100,             # 总记录数
            "page": 1,                # 当前页码
            "page_size": 20,          # 每页数量
            "total_pages": 5          # 总页数
        }
    """

    # 默认每页数量
    page_size = 20

    # 允许客户端通过 page_size 参数指定每页数量
    page_size_query_param = 'page_size'

    # 最大每页数量
    max_page_size = 100

    def get_paginated_response(self, data):
        """自定义分页响应格式"""
        return Response({
            'items': data,
            'total': self.page.paginator.count,
            'page': self.page.number,
            'page_size': self.get_page_size(self.request),
            'total_pages': self.page.paginator.num_pages,
        })


class LargeResultsSetPagination(PageNumberPagination):
    """
    大数据集分页器

    用于导出、报表等需要更大数据量的场景
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200

    def get_paginated_response(self, data):
        """自定义分页响应格式"""
        return Response({
            'items': data,
            'total': self.page.paginator.count,
            'page': self.page.number,
            'page_size': self.get_page_size(self.request),
            'total_pages': self.page.paginator.num_pages,
        })

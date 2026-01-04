"""自定义DRF Renderer - 统一响应格式"""
from rest_framework.renderers import JSONRenderer


class ApiJSONRenderer(JSONRenderer):
    """
    自定义JSON渲染器 - 自动包装响应格式

    对于已经包含code字段的响应（使用了utils.response的响应），不做处理
    对于原始数据响应，自动包装成统一格式

    Examples:
        # View返回原始数据
        return Response({'id': 1, 'name': 'test'})
        # 自动包装为
        {"code": 0, "message": "成功", "data": {"id": 1, "name": "test"}}

        # View使用utils.response
        return success(data={'id': 1})
        # 保持不变
        {"code": 0, "message": "成功", "data": {"id": 1}}
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """渲染响应数据"""
        if data is None:
            return super().render(data, accepted_media_type, renderer_context)

        # 如果已经是统一格式（包含code字段），不做处理
        if isinstance(data, dict) and 'code' in data:
            return super().render(data, accepted_media_type, renderer_context)

        # 获取响应对象
        response = renderer_context.get('response') if renderer_context else None

        # 如果是DRF的特殊响应（如分页），保持原样
        if isinstance(data, dict) and ('results' in data or 'detail' in data):
            # 检查是否是DRF的分页响应
            if 'results' in data and 'count' in data:
                # 转换DRF分页格式为我们的格式
                wrapped_data = {
                    'code': 0,
                    'message': '获取成功',
                    'data': {
                        'items': data.get('results', []),
                        'total': data.get('count', 0),
                        'next': data.get('next'),
                        'previous': data.get('previous'),
                    }
                }
                return super().render(wrapped_data, accepted_media_type, renderer_context)

            # 如果是错误详情（DRF的异常响应），保持原样交给异常处理器
            if 'detail' in data:
                return super().render(data, accepted_media_type, renderer_context)

        # 包装原始数据
        wrapped_data = {
            'code': 0,
            'message': '成功',
            'data': data,
        }

        return super().render(wrapped_data, accepted_media_type, renderer_context)

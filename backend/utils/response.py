"""统一API响应格式"""
from typing import Any, Optional
from rest_framework.response import Response as DRFResponse
from rest_framework import status


class ResponseCode:
    """响应状态码"""
    SUCCESS = 0  # 成功
    FAILED = 1  # 失败
    UNAUTHORIZED = 401  # 未授权
    FORBIDDEN = 403  # 禁止访问
    NOT_FOUND = 404  # 不存在
    METHOD_NOT_ALLOWED = 405  # 方法不允许
    SERVER_ERROR = 500  # 服务器错误
    VALIDATION_ERROR = 400  # 参数验证错误


class ApiResponse:
    """
    统一API响应格式

    使用方式：
        from utils.response import success, error

        # 成功响应
        return success(data={'id': 1, 'name': 'test'})
        return success(data=[1, 2, 3], message='获取列表成功')

        # 失败响应
        return error(message='参数错误')
        return error(message='未找到', code=ResponseCode.NOT_FOUND)
    """

    @staticmethod
    def response(
        data: Any = None,
        message: str = '成功',
        code: int = ResponseCode.SUCCESS,
        http_status: int = status.HTTP_200_OK,
        **kwargs
    ) -> DRFResponse:
        """
        统一响应格式

        Args:
            data: 响应数据
            message: 响应消息
            code: 业务状态码
            http_status: HTTP状态码
            **kwargs: 其他需要添加到响应中的字段

        Returns:
            DRFResponse对象
        """
        response_data = {
            'code': code,
            'message': message,
            'data': data,
        }

        # 添加额外字段
        if kwargs:
            response_data.update(kwargs)

        return DRFResponse(response_data, status=http_status)

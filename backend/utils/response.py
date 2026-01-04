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


def success(
    data: Any = None,
    message: str = '成功',
    http_status: int = status.HTTP_200_OK,
    **kwargs
) -> DRFResponse:
    """
    成功响应

    Args:
        data: 响应数据
        message: 响应消息
        http_status: HTTP状态码
        **kwargs: 其他需要添加到响应中的字段

    Returns:
        DRFResponse对象

    Examples:
        >>> success(data={'id': 1})
        {"code": 0, "message": "成功", "data": {"id": 1}}

        >>> success(data=[1, 2, 3], message='获取列表成功')
        {"code": 0, "message": "获取列表成功", "data": [1, 2, 3]}

        >>> success(message='操作成功', http_status=status.HTTP_201_CREATED)
        {"code": 0, "message": "操作成功", "data": null}
    """
    return ApiResponse.response(
        data=data,
        message=message,
        code=ResponseCode.SUCCESS,
        http_status=http_status,
        **kwargs
    )


def error(
    message: str = '失败',
    code: int = ResponseCode.FAILED,
    data: Any = None,
    http_status: int = status.HTTP_400_BAD_REQUEST,
    **kwargs
) -> DRFResponse:
    """
    失败响应

    Args:
        message: 错误消息
        code: 业务状态码
        data: 错误详情数据
        http_status: HTTP状态码
        **kwargs: 其他需要添加到响应中的字段

    Returns:
        DRFResponse对象

    Examples:
        >>> error(message='参数错误')
        {"code": 1, "message": "参数错误", "data": null}

        >>> error(message='未找到', code=ResponseCode.NOT_FOUND, http_status=status.HTTP_404_NOT_FOUND)
        {"code": 404, "message": "未找到", "data": null}

        >>> error(message='验证失败', data={'field': ['error msg']})
        {"code": 1, "message": "验证失败", "data": {"field": ["error msg"]}}
    """
    return ApiResponse.response(
        data=data,
        message=message,
        code=code,
        http_status=http_status,
        **kwargs
    )


def paginated_success(
    data: list,
    total: int,
    page: int = 1,
    page_size: int = 20,
    message: str = '获取成功',
    **kwargs
) -> DRFResponse:
    """
    分页成功响应

    Args:
        data: 分页数据列表
        total: 总数
        page: 当前页码
        page_size: 每页数量
        message: 响应消息
        **kwargs: 其他需要添加到响应中的字段

    Returns:
        DRFResponse对象

    Examples:
        >>> paginated_success(data=[1, 2, 3], total=100, page=1, page_size=20)
        {
            "code": 0,
            "message": "获取成功",
            "data": {
                "items": [1, 2, 3],
                "total": 100,
                "page": 1,
                "page_size": 20,
                "total_pages": 5
            }
        }
    """
    import math

    total_pages = math.ceil(total / page_size) if page_size > 0 else 0

    return success(
        data={
            'items': data,
            'total': total,
            'page': page,
            'page_size': page_size,
            'total_pages': total_pages,
        },
        message=message,
        **kwargs
    )

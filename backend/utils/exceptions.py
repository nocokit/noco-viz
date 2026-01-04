"""统一异常处理"""
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.exceptions import (
    ValidationError,
    PermissionDenied,
    NotAuthenticated,
    NotFound,
    MethodNotAllowed,
    APIException,
)
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from .response import ResponseCode
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    自定义异常处理器 - 统一异常响应格式

    将所有异常转换为统一的响应格式：
    {"code": xxx, "message": "错误消息", "data": null}

    Args:
        exc: 异常对象
        context: 异常上下文

    Returns:
        Response对象
    """
    # 先调用DRF默认的异常处理器
    response = drf_exception_handler(exc, context)

    # 如果DRF处理了异常，转换为统一格式
    if response is not None:
        # 记录异常日志
        view = context.get('view', None)
        request = context.get('request', None)
        logger.error(
            f'API异常: {exc.__class__.__name__} - {str(exc)} '
            f'| View: {view.__class__.__name__ if view else "Unknown"} '
            f'| Path: {request.path if request else "Unknown"}'
        )

        # 转换为统一格式
        custom_response_data = {
            'code': _get_error_code(exc),
            'message': _get_error_message(exc, response),
            'data': None,
        }

        # 在开发环境下，添加详细错误信息
        from django.conf import settings
        if settings.DEBUG:
            custom_response_data['debug'] = {
                'exception': exc.__class__.__name__,
                'detail': str(exc),
                'original_data': response.data,
            }

        response.data = custom_response_data
        return response

    # 处理Django原生异常（DRF未处理的）
    if isinstance(exc, Http404):
        from rest_framework.response import Response
        return Response(
            {
                'code': ResponseCode.NOT_FOUND,
                'message': '资源不存在',
                'data': None,
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if isinstance(exc, DjangoPermissionDenied):
        from rest_framework.response import Response
        return Response(
            {
                'code': ResponseCode.FORBIDDEN,
                'message': '权限不足',
                'data': None,
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # 处理未知异常
    logger.exception(f'未处理的异常: {exc.__class__.__name__} - {str(exc)}')

    from rest_framework.response import Response
    from django.conf import settings

    error_data = {
        'code': ResponseCode.SERVER_ERROR,
        'message': '服务器错误' if not settings.DEBUG else str(exc),
        'data': None,
    }

    if settings.DEBUG:
        error_data['debug'] = {
            'exception': exc.__class__.__name__,
            'detail': str(exc),
        }

    return Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def _get_error_code(exc) -> int:
    """
    根据异常类型获取业务错误码

    Args:
        exc: 异常对象

    Returns:
        错误码
    """
    if isinstance(exc, ValidationError):
        return ResponseCode.VALIDATION_ERROR

    if isinstance(exc, NotAuthenticated):
        return ResponseCode.UNAUTHORIZED

    if isinstance(exc, PermissionDenied):
        return ResponseCode.FORBIDDEN

    if isinstance(exc, NotFound):
        return ResponseCode.NOT_FOUND

    if isinstance(exc, MethodNotAllowed):
        return ResponseCode.METHOD_NOT_ALLOWED

    if isinstance(exc, APIException):
        # 使用HTTP状态码作为业务错误码
        return exc.status_code

    return ResponseCode.SERVER_ERROR


def _get_error_message(exc, response) -> str:
    """
    获取错误消息

    Args:
        exc: 异常对象
        response: DRF响应对象

    Returns:
        错误消息字符串
    """
    # 尝试从response.data中提取消息
    if response and response.data:
        data = response.data

        # 情况1: {'detail': 'error message'}
        if isinstance(data, dict) and 'detail' in data:
            detail = data['detail']
            if isinstance(detail, str):
                return detail
            elif isinstance(detail, list) and len(detail) > 0:
                return str(detail[0])

        # 情况2: {'field_name': ['error1', 'error2']}
        if isinstance(data, dict):
            # 收集所有字段的错误消息
            errors = []
            for field, messages in data.items():
                if isinstance(messages, list):
                    for msg in messages:
                        errors.append(f'{field}: {msg}')
                else:
                    errors.append(f'{field}: {messages}')

            if errors:
                return '; '.join(errors)

        # 情况3: ['error1', 'error2']
        if isinstance(data, list) and len(data) > 0:
            return str(data[0])

        # 情况4: 直接是字符串
        if isinstance(data, str):
            return data

    # 如果无法从response中提取，使用异常的默认消息
    if hasattr(exc, 'detail'):
        if isinstance(exc.detail, str):
            return exc.detail
        elif isinstance(exc.detail, dict):
            # 尝试获取第一个字段的错误
            for field, messages in exc.detail.items():
                if isinstance(messages, list) and len(messages) > 0:
                    return f'{field}: {messages[0]}'
                return f'{field}: {messages}'

    # 使用异常的字符串表示
    return str(exc)


class BusinessException(APIException):
    """
    业务异常基类

    用于抛出业务逻辑相关的异常

    Examples:
        raise BusinessException('用户不存在')
        raise BusinessException('余额不足', code=ResponseCode.FAILED)
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = '业务处理失败'
    default_code = 'business_error'

    def __init__(self, detail=None, code=None):
        """
        初始化业务异常

        Args:
            detail: 错误详情
            code: 业务错误码
        """
        if detail is None:
            detail = self.default_detail

        self.detail = detail

        if code is not None:
            self.business_code = code
        else:
            self.business_code = ResponseCode.FAILED


def _get_error_code(exc) -> int:
    """获取错误码（更新版本，支持BusinessException）"""
    # 如果是BusinessException，使用其业务错误码
    if isinstance(exc, BusinessException):
        return getattr(exc, 'business_code', ResponseCode.FAILED)

    if isinstance(exc, ValidationError):
        return ResponseCode.VALIDATION_ERROR

    if isinstance(exc, NotAuthenticated):
        return ResponseCode.UNAUTHORIZED

    if isinstance(exc, PermissionDenied):
        return ResponseCode.FORBIDDEN

    if isinstance(exc, NotFound):
        return ResponseCode.NOT_FOUND

    if isinstance(exc, MethodNotAllowed):
        return ResponseCode.METHOD_NOT_ALLOWED

    if isinstance(exc, APIException):
        return exc.status_code

    return ResponseCode.SERVER_ERROR

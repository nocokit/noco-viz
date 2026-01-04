"""
自定义验证器
"""
import re
from django.core.exceptions import ValidationError


def validate_phone(value):
    """
    验证手机号
    """
    pattern = r'^1[3-9]\d{9}$'
    if not re.match(pattern, value):
        raise ValidationError('请输入正确的手机号码')
    return value


def validate_id_card(value):
    """
    验证身份证号（简单验证）
    """
    if not value:
        return value

    pattern = r'^\d{17}[\dXx]$'
    if not re.match(pattern, value):
        raise ValidationError('请输入正确的身份证号码')
    return value


def validate_positive_number(value):
    """
    验证正数
    """
    if value <= 0:
        raise ValidationError('数值必须大于0')
    return value

"""
自定义权限类
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    管理员权限
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsManagerOrAdmin(permissions.BasePermission):
    """
    店长或管理员权限
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['manager', 'admin']


class IsCashierOrAbove(permissions.BasePermission):
    """
    收银员及以上权限
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['cashier', 'manager', 'admin']


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    对象所有者或管理员权限
    """
    def has_object_permission(self, request, view, obj):
        # 管理员拥有所有权限
        if request.user.role == 'admin':
            return True

        # 检查是否是对象所有者
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'created_by'):
            return obj.created_by == request.user

        return False

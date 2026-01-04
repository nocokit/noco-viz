"""用户认证相关ViewSet"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import User
from apps.users.serializers import (
    RegisterSerializer,
    LoginSerializer,
    RefreshTokenSerializer,
    ChangePasswordSerializer,
    UserSerializer,
)


class AuthViewSet(viewsets.ViewSet):
    """
    用户认证ViewSet

    提供注册、登录、刷新token、修改密码等功能
    """

    @action(methods=['post'], detail=False, permission_classes=[AllowAny])
    def register(self, request):
        """
        用户注册

        POST /api/auth/register/
        """
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 创建用户
        user = serializer.save()

        # 生成JWT token
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'phone': user.phone,
            },
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=False, permission_classes=[AllowAny])
    def login(self, request):
        """
        用户登录

        POST /api/auth/login/
        支持用户名或手机号登录
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        # 尝试用户名登录
        user = authenticate(username=username, password=password)

        # 如果用户名登录失败,尝试手机号登录
        if not user:
            try:
                user_obj = User.objects.get(phone=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            raise AuthenticationFailed('用户名或密码错误')

        if not user.is_active:
            raise AuthenticationFailed('用户已被禁用')

        # 生成JWT token
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'phone': user.phone,
            },
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        })

    @action(methods=['post'], detail=False, permission_classes=[AllowAny])
    def refresh(self, request):
        """
        刷新token

        POST /api/auth/refresh/
        """
        serializer = RefreshTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh = RefreshToken(serializer.validated_data['refresh'])
        return Response({
            'access': str(refresh.access_token),
        })

    @action(methods=['get'], detail=False, permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        获取当前用户信息

        GET /api/auth/me/
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(methods=['post'], detail=False, permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """
        修改密码

        POST /api/auth/change_password/
        """
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        # 设置新密码
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()

        return Response({'message': '密码修改成功'})

    @action(methods=['post'], detail=False, permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        退出登录（客户端清除token即可）

        POST /api/auth/logout/
        """
        # JWT是无状态的,服务端不需要做什么
        # 客户端删除本地存储的token即可
        return Response({'message': '退出成功'})

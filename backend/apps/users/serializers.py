"""用户相关序列化器"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    """用户基础序列化器"""

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone',
            'avatar',
            'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class UserDetailSerializer(serializers.ModelSerializer):
    """用户详情序列化器"""

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone',
            'avatar',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RegisterSerializer(serializers.Serializer):
    """用户注册序列化器"""
    username = serializers.CharField(
        required=True,
        max_length=150,
        help_text='用户名'
    )
    phone = serializers.CharField(
        required=True,
        max_length=11,
        help_text='手机号'
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=6,
        help_text='密码（至少6位）'
    )
    password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        help_text='确认密码'
    )

    def validate_username(self, value):
        """验证用户名是否已存在"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('用户名已存在')
        return value

    def validate_phone(self, value):
        """验证手机号格式和是否已存在"""
        # 简单的手机号格式验证
        if not value.isdigit() or len(value) != 11:
            raise serializers.ValidationError('手机号格式不正确')

        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError('手机号已被注册')

        return value

    def validate(self, attrs):
        """验证两次密码是否一致"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': '两次密码不一致'})

        # 使用Django的密码验证器
        try:
            validate_password(attrs['password'])
        except Exception as e:
            raise serializers.ValidationError({'password': list(e.messages)})

        return attrs

    def create(self, validated_data):
        """创建用户"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        return user


class LoginSerializer(serializers.Serializer):
    """用户登录序列化器"""
    username = serializers.CharField(
        required=True,
        help_text='用户名/手机号/邮箱'
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        help_text='密码'
    )


class RefreshTokenSerializer(serializers.Serializer):
    """刷新token序列化器"""
    refresh = serializers.CharField(
        required=True,
        help_text='Refresh Token'
    )

    def validate_refresh(self, value):
        """验证refresh token是否有效"""
        try:
            RefreshToken(value)
        except TokenError:
            raise serializers.ValidationError('refresh token无效或已过期')
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """修改密码序列化器"""
    old_password = serializers.CharField(
        required=True,
        write_only=True,
        help_text='旧密码'
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=6,
        help_text='新密码（至少6位）'
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        help_text='确认新密码'
    )

    def validate_old_password(self, value):
        """验证旧密码是否正确"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('旧密码不正确')
        return value

    def validate(self, attrs):
        """验证两次新密码是否一致"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password_confirm': '两次密码不一致'})

        # 验证新密码不能与旧密码相同
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError({'new_password': '新密码不能与旧密码相同'})

        # 使用Django的密码验证器
        try:
            validate_password(attrs['new_password'])
        except Exception as e:
            raise serializers.ValidationError({'new_password': list(e.messages)})

        return attrs

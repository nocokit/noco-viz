"""用户序列化器"""
from rest_framework import serializers
from apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    """用户基础序列化器"""

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'phone',
            'avatar',
            'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class UserDetailSerializer(serializers.ModelSerializer):
    """用户详情序列化器（包含商铺信息）"""
    shops = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'phone',
            'avatar',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

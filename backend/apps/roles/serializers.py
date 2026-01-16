from rest_framework import serializers
from apps.roles.models import Role


class RoleSerializer(serializers.ModelSerializer):
    """角色序列化器"""

    user_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Role
        fields = [
            'id', 'name', 'description', 'is_system', 'scope',
            'permissions', 'user_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        """验证角色名称唯一性"""
        instance = self.instance
        if instance:
            # 更新时排除自己
            if Role.objects.exclude(pk=instance.pk).filter(name=value).exists():
                raise serializers.ValidationError('角色名称已存在')
        else:
            # 创建时检查
            if Role.objects.filter(name=value).exists():
                raise serializers.ValidationError('角色名称已存在')
        return value


class RoleListSerializer(serializers.ModelSerializer):
    """角色列表序列化器（简化版）"""

    user_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Role
        fields = [
            'id', 'name', 'description', 'is_system', 'scope',
            'user_count', 'created_at', 'updated_at'
        ]

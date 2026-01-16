from rest_framework import serializers
from apps.projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """项目序列化器"""

    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'type', 'description', 'cover_image',
            'status', 'config', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        # 自动设置创建人
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ProjectListSerializer(serializers.ModelSerializer):
    """项目列表序列化器（简化版）"""

    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'type', 'description', 'cover_image',
            'status', 'created_by_name', 'updated_at'
        ]

from rest_framework import serializers
from apps.datasets.models import Dataset, Connection


class DatasetSerializer(serializers.ModelSerializer):
    """数据集序列化器"""

    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Dataset
        fields = [
            'id', 'name', 'type', 'config', 'fields', 'row_count',
            'status', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class DatasetListSerializer(serializers.ModelSerializer):
    """数据集列表序列化器"""

    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Dataset
        fields = [
            'id', 'name', 'type', 'row_count', 'status',
            'created_by_name', 'updated_at'
        ]


class ConnectionSerializer(serializers.ModelSerializer):
    """数据库连接序列化器"""

    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Connection
        fields = [
            'id', 'name', 'type', 'host', 'port', 'database',
            'username', 'password', 'status', 'last_test_time',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'status', 'last_test_time', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        # 加密密码
        password = validated_data.pop('password', None)
        connection = super().create(validated_data)
        if password:
            connection.set_password(password)
            connection.save()
        return connection

    def update(self, instance, validated_data):
        # 如果更新密码，需要加密
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance


class ConnectionListSerializer(serializers.ModelSerializer):
    """连接列表序列化器"""

    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Connection
        fields = [
            'id', 'name', 'type', 'host', 'port', 'database',
            'status', 'last_test_time', 'created_by_name', 'updated_at'
        ]

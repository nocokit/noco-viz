from django.contrib import admin
from apps.datasets.models import Dataset, Connection


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type', 'status', 'row_count', 'created_by', 'created_at']
    list_filter = ['type', 'status', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type', 'host', 'port', 'status', 'created_by', 'created_at']
    list_filter = ['type', 'status', 'created_at']
    search_fields = ['name', 'host']
    readonly_fields = ['created_at', 'updated_at', 'last_test_time']

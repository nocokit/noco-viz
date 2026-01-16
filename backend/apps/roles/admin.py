from django.contrib import admin
from apps.roles.models import Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'is_system', 'scope', 'created_at']
    list_filter = ['is_system', 'scope', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']

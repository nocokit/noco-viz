from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import AuthViewSet

app_name = 'users'

# 创建router
router = DefaultRouter()

# 注册ViewSet
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    # 使用router自动生成的路由
    path('', include(router.urls)),
]

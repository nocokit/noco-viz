from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.datasets.views import DatasetViewSet, ConnectionViewSet

router = DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='dataset')
router.register(r'connections', ConnectionViewSet, basename='connection')

urlpatterns = [
    path('', include(router.urls)),
]

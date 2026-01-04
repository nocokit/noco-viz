"""自定义认证后端"""
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from apps.users.models import User


class MultiFieldAuthBackend(ModelBackend):
    """
    支持多字段登录的认证后端

    支持使用 username、phone 或 email 进行登录
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        认证用户

        Args:
            request: HTTP 请求对象
            username: 用户输入的用户名/手机号/邮箱
            password: 密码

        Returns:
            User 对象或 None
        """
        if username is None or password is None:
            return None

        try:
            # 尝试通过 username、phone 或 email 查找用户
            user = User.objects.get(
                Q(username=username) | Q(phone=username) | Q(email=username)
            )
        except User.DoesNotExist:
            # 运行默认的密码哈希算法以防止时序攻击
            User().set_password(password)
            return None
        except User.MultipleObjectsReturned:
            # 如果存在多个匹配的用户，返回第一个
            user = User.objects.filter(
                Q(username=username) | Q(phone=username) | Q(email=username)
            ).first()

        # 验证密码
        if user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None

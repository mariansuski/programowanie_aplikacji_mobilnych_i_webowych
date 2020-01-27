import redis
from .user import User


class Users:
    def __init__(self, url):
        self.redis = redis.from_url(url)
        self.keys = [
            "first_name",
            "last_name",
            "password",
            "birth_date",
            "login",
            "pesel",
            "sex",
            "token",
        ]

    def add(self, user):
        user_data = user.get_data()
        user_data = {k: v for k, v in user_data.items() if v is not None}
        self.redis.hmset(user.login, user_data)

    def update(self, login, values):
        self.redis.hmset(login, values)

    def get(self, login):
        user_data = self.redis.hmget(login, keys=self.keys)
        user_data = [element.decode("utf-8") if element is not None else None for element in user_data]
        return User(*user_data)

    def delete(self, login, field):
        self.redis.hdel(login, field)

from django.urls import re_path,path
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    path(r'ws/stock/track/', consumers.StockConsumer.as_asgi()),
]
from django.urls import re_path 
# from channels.auth import AuthMiddlewareStack
# from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
# from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from asgi_gate.consumers import NotificationConsumer


websocket_urlpatterns = [
    re_path(r'ws/notification/$', NotificationConsumer.as_asgi()),
]



# application = ProtocolTypeRouter({
#     'websocket':AllowedHostsOriginValidator(
#         AuthMiddlewareStack(
#             URLRouter(
#                 [
#                     path('notifications', NotificationConsumer)
#                 ]
#             )   
#         )
#     )
# })
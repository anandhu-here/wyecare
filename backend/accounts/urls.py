from collections import UserList
from django.urls import path
from .api import RegisterAPI, LoginAPI, UserListView, UserAPI, getProfile, invite_homes, upload_docs, DocUploadView

urlpatterns = [
    path('signup', RegisterAPI.as_view()),
    path('login', LoginAPI.as_view()),
    path('user', UserAPI),
    path('users', UserListView),
    path('profile', getProfile),
    path('send_invite', invite_homes),
    path('upload-doc', DocUploadView.as_view())
]
from collections import UserList
from django.urls import path
from .api import RegisterAPI, LoginAPI, UserListView, UserAPI, deleteDoc, getDocs, getIr, getProfile, getStaffs, invite_homes    , DocUploadView, joinRequest, joinRequestAccept, search

urlpatterns = [
    path('signup', RegisterAPI.as_view()),
    path('login', LoginAPI.as_view()),
    path('user', UserAPI),
    path('users', UserListView),
    path('profile', getProfile),
    path('send_invite', invite_homes),
    path('upload-doc', DocUploadView.as_view()),
    path('get-docs', getDocs),
    path('delete-doc', deleteDoc),
    path('search', search),
    path('join-request', joinRequest),
    path('get-ir', getIr),
    path('ir-accept', joinRequestAccept),
    path('get-carers', getStaffs)
]
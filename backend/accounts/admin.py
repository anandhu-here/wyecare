from django.contrib import admin

from .models import AgentProfile, Docs, Documents, HomeProfile, InviteRequests, Profile, TrainingCertificates, User

# Register your models here.

admin.site.register((User, Profile, HomeProfile, TrainingCertificates, AgentProfile, Docs, Documents, InviteRequests))
from __future__ import unicode_literals
from pickle import FALSE
from sqlite3 import Timestamp
from tkinter.tix import Tree
from turtle import home, ondrag
from xml.sax.handler import property_xml_string
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator
from django.db.models import Q
from django.db.models.signals import pre_save, post_save
# from blissedmaths.utils import unique_otp_generator
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save

from datetime import datetime


class UserManager(BaseUserManager):
    def create_user(self, email, push_token=None, password=None, is_staff=False, is_active=True,  is_agent = False, is_admin=False, is_home = False, is_carer=False):
        if not email:
            raise ValueError('users must have a valid email')

        user_obj = self.model(
            email=email
        )
        user_obj.set_password(password)
        user_obj.push_token=push_token
        user_obj.staff = is_staff
        user_obj.home = is_home
        user_obj.carer = is_carer
        user_obj.admin = is_admin
        user_obj.active = is_active
        user_obj.agent = is_agent
        user_obj.save(using=self._db)
        return user_obj
    def create_carer_user(self, email, password, push_token):
        user= self.create_user(
            email,
            push_token=push_token,
            password=password,
            is_carer=True
        )
        return user
    def create_agent(self, email,push_token, password=None):
        user = self.create_user(
            email,
            push_token=push_token,
            password=password,
            is_agent=True
        )
        return user
    def create_staffuser(self, email,first_name, last_name,push_token, password=None):
        user = self.create_user(
            email,
            push_token=push_token,
            password=password,
            is_staff=True
        )
        return user

    def create_superuser(self, email,password=None, push_token=None):
        user = self.create_user(
            email,
            push_token=push_token,
            password=password,
            is_staff=True,
            is_admin=True,

        )
        return user
    def create_home_user(self, email,push_token, password=None):
        user = self.create_user(
            email,
            push_token=push_token,
            password=password,
            is_home=True
        )
        return user

class User(AbstractBaseUser):
    email       = models.EmailField(blank=False, null=False, unique=True)
    standard    = models.CharField(max_length = 3, blank = True, null = True)
    push_token  = models.TextField(blank=True, null=True)
    score       = models.IntegerField(default = 16)
    first_login = models.BooleanField(default=False)
    active      = models.BooleanField(default=True)
    staff       = models.BooleanField(default=False)
    admin       = models.BooleanField(default=False)
    home        = models.BooleanField(default=False)
    carer       = models.BooleanField(default=True)
    nurse       = models.BooleanField(default=False)
    agent       = models.BooleanField(default=False)
    timestamp   = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        if self.email:
            return str(self.email)
        else:return str(self.id)
    
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):

        return True

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin

    @property
    def is_active(self):
        return self.active
    
    @property
    def is_home(self):
        return self.home
    @property
    def is_nurse(self):
        return self.nurse
    @property
    def is_carer(self):
        return self.carer
    @property
    def is_agent(self):
        return self.agent


def imageUpload(self, filename):
    return f'images/profile/{self.user.email}/{filename}'
def fileUPload(self, filename):
    return f'files/{self.profile.first_name} - {self.profile.id}/{filename}'   


class AgentProfile(models.Model):
    agent = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField(blank=True, null=True)
    postcode = models.CharField(User, max_length=6, blank=True, null=True)
    address = models.TextField(User, blank=True, null=True)
    phone = models.CharField(blank=True, null=True, max_length=12)
    key = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        if self.name:
            return self.name
        else:
            return str(self.id)
class HomeProfile(models.Model):
    home = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=200, blank=True, null=True)
    postcode = models.CharField(max_length=100, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    agent = models.ManyToManyField(AgentProfile)
    def __str__(self):
        if self.name:
            return self.name 
        else:
            return self.home.email




class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(blank=True, null=True, max_length=200)
    last_name = models.CharField(blank=True, null=True, max_length=200)
    profile_picture = models.ImageField(upload_to=imageUpload, blank=True, null = True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    agent = models.ManyToManyField(AgentProfile)
    key = models.CharField(max_length=100, blank=True, null=True)
    
    @property
    def get_pos(self):
        if self.user.is_carer:
            return "CARER"
        elif self.user.is_nurse:
            return "NURSE"
    def __str__(self):
        if self.first_name:
            return str(self.first_name) + " " + str(self.last_name) + " " + str(self.id)
        else:
            return self.user.email
    
class InviteRequests(models.Model):
    profileId = models.IntegerField()
    agencyId = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    
class TrainingCertificates(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=True, null=True)
    file = models.FileField(blank=True, null=True, upload_to=fileUPload)
    uploaded = models.DateTimeField(auto_created=True)

    def __str__(self):
        return str(self.name)

class Trainings(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    file = models.FileField(upload_to=fileUPload, blank=True, null = True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    Timestamp = models.DateTimeField(auto_now=True)

class Docs(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    key = models.IntegerField(blank=True, null=True)
    file = models.FileField(upload_to=fileUPload, blank=True, null = True)
    Timestamp = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=200, blank=True, null=True)

class Documents(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name

    

class FollowerRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


def user_did_save(sender, instance, created, *args, **kwargs):
    if created:
        print(instance.is_home, instance.is_agent, instance.is_carer, "pst ")
        if instance.is_home:
            HomeProfile.objects.get_or_create(home=instance)
        if instance.is_agent:
            AgentProfile.objects.get_or_create(agent=instance)
        if instance.is_carer:
            Profile.objects.get_or_create(user=instance)

post_save.connect(user_did_save, sender=User)


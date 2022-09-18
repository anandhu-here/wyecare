
import json
from secrets import choice
from tkinter import CASCADE
from tkinter.tix import Tree
from django.db import models
from django.contrib.auth import get_user_model
import requests
from accounts.models import AgentProfile, Profile
from accounts.models import HomeProfile
from django.db.models.signals import post_save
import requests as rq
User = get_user_model()


# Create your models here.
weeks = [(0, 0), (1, 1), (2, 2), (3, 3)]
months = [(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10), (11, 11)]
class ShiftName(models.Model):
    longday = models.IntegerField(default=0, blank=True, null=True) 
    night = models.IntegerField(default=0, blank=True, null=True) 
    late = models.IntegerField(default=0, blank=True, null=True) 
    early = models.IntegerField(default=0, blank=True, null=True) 
    home = models.ForeignKey(HomeProfile, on_delete=models.CASCADE)
    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE)
    # days = [(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6),(6, 6),(7, 7),(8, 8),(9, 9),(10, 10),(11, 11),(12, 12),(13, 13),(14, 14),(15, 15),(16, 16),(17, 17),(18, 18),(19, 19),(20, 20),(21, 21),(22, 22),(23, 23),(24, 24),(25, 25),(26, 26),(27, 27),(28, 28),(29, 29),(30, 30) ]
    day = models.CharField(blank=True, null=True, max_length=2)  
    month = models.CharField(blank=True, null=True, max_length=2) 
    year = models.IntegerField(blank=True, null=True) 
    def __str__(self):
        if self.home.name:
            return str(self.home.name) + " " + str(self.day) + "-" + str(self.month) + "-" + str(self.year) + str(self.id)
        else:
            return str(self.day)

    @property
    def get_home_data(self):
        return self.home.name
    @property
    def get_agent_data(self):
        return self.home.agent
    @property
    def get_home_id(self):
        return self.home.id

class Employee(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE) 
    def __str__(self):
        return str(self.profile.user.email)


class Date(models.Model):
   id = models.IntegerField(primary_key=True)
   date = models.DateField(auto_now=False, auto_now_add=False, null=True)   
   dayofweek = models.IntegerField(blank=True, null=True)
   def save(self, *args, **kwargs):
       self.dayofweek = self.date.weekday()       
       super(Date, self).save(*args, **kwargs)



class ShiftAssignment(models.Model):
    type = models.CharField(choices=(('LATE', 'LATE'), ('LONGDAY', 'LONGDAY'), ('NIGHT', 'NIGHT'),('EARLY', 'EARLY')), max_length=100)
    shiftname = models.ForeignKey(ShiftName, on_delete=models.CASCADE)
    employee = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="profiles", blank=True, null=True) 
    selected = models.CharField(choices=(('LATE', 'LATE'), ('LONGDAY', 'LONGDAY'), ('NIGHT', 'NIGHT'),('EARLY', 'EARLY')), max_length=100, blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)
    covered = models.BooleanField(default=False)
    def __str__(self):
        return str(self.employee.first_name) 

def imageUpload(self, filename):
    return f'images/profile/{self.profile.first_name}/{filename}'

class Timesheets(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    home = models.ForeignKey(HomeProfile, on_delete=models.CASCADE)
    type = models.CharField(choices=(('LATE', 'LATE'), ('LONGDAY', 'LONGDAY'), ('NIGHT', 'NIGHT'),('EARLY', 'EARLY')), max_length=100)
    shiftname = models.ForeignKey(ShiftName, on_delete=models.CASCADE)
    sign = models.ImageField(upload_to=imageUpload, blank=True, null = True)
    auth_name = models.CharField(max_length=200, blank=True, null=True)
    auth_position = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return str(self.profile.first_name)

class Notifications(models.Model):
    home = models.ForeignKey(HomeProfile, on_delete=models.CASCADE, blank=True, null=True)
    shift = models.ForeignKey(ShiftName, on_delete=models.CASCADE, blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    type = models.IntegerField(choices=((0, "SHIFT_ADD"), (1, "CANCEL_SHIFT"), (2, "SHIFT_ASSIGN")), max_length=100, blank=True, null=True)
    employee = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True)
    dealt = models.BooleanField(default=False)
    date_added = models.DateTimeField(auto_now=True)
    shift_ass = models.ForeignKey(ShiftAssignment, on_delete=models.CASCADE, blank=True, null=True)
    @property
    def get_home_data(self):
        if self.home:
            return {
            "home":self.home.name,
            "id":self.home.id
            }
        else:
            return False
        
    
    def __str__(self):
        return str(self.id)


# class Notifications(models.Model):
#     shift = models.ForeignKey(ShiftName, on_delete=models.CASCADE)
#     type = models.CharField(choices=((0, "SHIFT_ADD"), (1, "CANCEL_SHIFT"), (2, "SHIFT_ASSIGN")), max_length=100)
#     body = models.TextField(blank=True, null=True)
#     dealt = models.BooleanField(default=False)
#     date_added = models.DateTimeField(auto_now=True)
#     employee = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True)
#     shift_ass = models.ForeignKey(ShiftAssignment, on_delete=models.CASCADE, blank=True, null=True)
#     @property
#     def get_home_data(self):
#         return {
#             "home":self.shift.home.name,
#             "id":self.shift.home.home.id
#         }
    
#     def __str__(self):
#         return str(self.id)
    
def notify_shift_added(home, sender):
    # shiftname = ShiftName.objects.get(home=home)
    print(home, "kkkkk")
    # not_obj = Notifications.objects.create(shift=shiftname)
    # not_obj.save()
# def shift_assigned_signal(sender, ins, created, *args, **kwargs):
#     print(created , "cre")
#     if created:
#         Notifications.objects.get_or_create(shift=ins)
#         assigned = ShiftAssignment.objects.filter(shiftname=ins)
#         print(assigned, "Assss")
#         for ass in assigned:
#             token = ass.employee.user.push_token
#             print(token, "l0")
#             message={
#                 'to':token,
#                 'title':f'Shift booked',
#                 'body':f'Shift booked in {ass.shiftname.home.name}'
#             }
#             rq.post('https://exp.host/--/api/v2/push/send', json = message)


def shift_added_signal(sender, instance, created, *args, **kwargs):
    if created:
        Notifications.objects.get_or_create(shift=instance)

post_save.connect(shift_added_signal, sender=ShiftName)



from django.contrib import admin

from .models import Employee, Notifications, ShiftAssignment, ShiftName, Timesheets

# Register your models here.
admin.site.register((ShiftName, ShiftAssignment, Employee, Notifications, Timesheets))